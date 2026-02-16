import { z } from "zod"

// ── Types ───────────────────────────────────────────────────────────────────

export interface MembraneConfig {
  apiKey: string
  apiUrl?: string
}

export interface ToolDefinition<TInput = any> {
  name: string
  description: string
  parameters: z.ZodObject<any>
  execute: (input: TInput, config: MembraneConfig) => Promise<unknown>
}

// ── Client ──────────────────────────────────────────────────────────────────

export class MembraneClient {
  private baseUrl: string
  private apiKey: string

  constructor(config: MembraneConfig) {
    this.baseUrl = (config.apiUrl ?? "https://api.getmembrane.com").replace(
      /\/$/,
      "",
    )
    this.apiKey = config.apiKey
  }

  async request(method: string, path: string, body?: unknown): Promise<any> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Membrane API error ${res.status}: ${text}`)
    }
    return res.json()
  }
}

// ── Helper ──────────────────────────────────────────────────────────────────

function defineTool<T extends z.ZodObject<any>>(def: {
  name: string
  description: string
  parameters: T
  execute: (input: z.infer<T>, config: MembraneConfig) => Promise<unknown>
}): ToolDefinition<z.infer<T>> {
  return def
}

// ── Tool Definitions ────────────────────────────────────────────────────────

export const listConnections = defineTool({
  name: "list-connections",
  description:
    "List all connections. A connection is an authenticated link to an external app (e.g. Slack, HubSpot).",
  parameters: z.object({}),
  execute: async (_input, config) => {
    const client = new MembraneClient(config)
    return client.request("GET", "/connections")
  },
})

export const searchConnectors = defineTool({
  name: "search-connectors",
  description:
    "Search for available connectors by keyword. A connector is a pre-built adapter for an external app. Returns matching connectors that can be used to create connections.",
  parameters: z.object({
    q: z.string().min(1).max(200).describe("Search query"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Max results"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    const params = new URLSearchParams({
      q: input.q,
      elementType: "connector",
    })
    if (input.limit) params.set("limit", String(input.limit))
    return client.request("GET", `/search?${params}`)
  },
})

export const searchTools = defineTool({
  name: "search-tools",
  description:
    "Search for actions (tools) available on a connection. Describe what you want to do in natural language.",
  parameters: z.object({
    connectionId: z.string().describe("Connection ID to search actions for"),
    intent: z
      .string()
      .max(200)
      .describe("Natural language description of what you want to do"),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Max results (default 10)"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    const params = new URLSearchParams({
      connectionId: input.connectionId,
      intent: input.intent,
    })
    if (input.limit) params.set("limit", String(input.limit))
    return client.request("GET", `/actions?${params}`)
  },
})

export const runTool = defineTool({
  name: "run-tool",
  description:
    "Run an action on a connection. Provide input matching the action's inputSchema.",
  parameters: z.object({
    actionId: z.string().describe("Action ID to run"),
    connectionId: z.string().describe("Connection ID to run the action on"),
    input: z.record(z.string(), z.any()).optional().describe("Action input parameters"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    const params = new URLSearchParams({ connectionId: input.connectionId })
    return client.request("POST", `/actions/${input.actionId}/run?${params}`, {
      input: input.input ?? {},
    })
  },
})

export const requestConnection = defineTool({
  name: "request-connection",
  description:
    "Create a connection request so the user can authenticate with an external app. Returns a URL the user must open to complete authentication.",
  parameters: z.object({
    connectorId: z.string().optional().describe("Connector ID"),
    integrationId: z.string().optional().describe("Integration ID"),
    integrationKey: z.string().optional().describe("Integration key"),
    connectionId: z
      .string()
      .optional()
      .describe("Existing connection ID (for reconnecting)"),
    name: z.string().optional().describe("Custom connection name"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    return client.request("POST", "/connection-requests", input)
  },
})

export const checkConnectionResult = defineTool({
  name: "check-connection-result",
  description:
    'Check the status of a connection request. Poll until status is "success" or "error".',
  parameters: z.object({
    requestId: z.string().describe("Connection request ID"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    return client.request("GET", `/connection-requests/${input.requestId}`)
  },
})

export const createAgentSession = defineTool({
  name: "create-agent-session",
  description:
    "Create a Membrane Agent session to build connectors or actions. Provide a prompt describing what to build.",
  parameters: z.object({
    prompt: z.string().describe("Task description for the agent"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    return client.request("POST", "/agent/sessions", { prompt: input.prompt })
  },
})

export const getAgentSession = defineTool({
  name: "get-agent-session",
  description:
    "Get agent session status. Use wait=true to long-poll until the session is idle or the timeout is reached.",
  parameters: z.object({
    sessionId: z.string().describe("Agent session ID"),
    wait: z
      .boolean()
      .optional()
      .describe("If true, long-poll until session is idle"),
    timeout: z
      .number()
      .int()
      .min(1)
      .max(60)
      .optional()
      .describe("Max wait in seconds (default 30)"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    const params = new URLSearchParams()
    if (input.wait !== undefined) params.set("wait", String(input.wait))
    if (input.timeout !== undefined)
      params.set("timeout", String(input.timeout))
    const qs = params.toString()
    return client.request(
      "GET",
      `/agent/sessions/${input.sessionId}${qs ? `?${qs}` : ""}`,
    )
  },
})

export const sendAgentMessage = defineTool({
  name: "send-agent-message",
  description: "Send a follow-up message to an active agent session.",
  parameters: z.object({
    sessionId: z.string().describe("Agent session ID"),
    input: z.string().describe("Message to send"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    return client.request("POST", `/agent/sessions/${input.sessionId}/message`, {
      input: input.input,
    })
  },
})

export const abortAgentSession = defineTool({
  name: "abort-agent-session",
  description: "Abort an active agent session.",
  parameters: z.object({
    sessionId: z.string().describe("Agent session ID"),
  }),
  execute: async (input, config) => {
    const client = new MembraneClient(config)
    return client.request(
      "POST",
      `/agent/sessions/${input.sessionId}/interrupt`,
    )
  },
})

// ── All Tools ───────────────────────────────────────────────────────────────

export const allTools: ToolDefinition[] = [
  listConnections,
  searchConnectors,
  searchTools,
  runTool,
  requestConnection,
  checkConnectionResult,
  createAgentSession,
  getAgentSession,
  sendAgentMessage,
  abortAgentSession,
]
