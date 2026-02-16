import { createServer } from "node:http"

const PORT = process.env.PORT || 3000
const API_TOKEN = process.env.MOCK_API_TOKEN || "test-token"

const MOCK_CONNECTIONS = [
  { id: "conn_1", name: "Slack", connectorId: "slack", status: "active" },
  { id: "conn_2", name: "HubSpot", connectorId: "hubspot", status: "active" },
]

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" })
  res.end(JSON.stringify(data))
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const auth = req.headers.authorization

  // Health check (no auth required)
  if (url.pathname === "/health") {
    return json(res, 200, { status: "ok" })
  }

  // Validate auth on all other routes
  if (auth !== `Bearer ${API_TOKEN}`) {
    return json(res, 401, { error: "Unauthorized" })
  }

  // GET /connections
  if (req.method === "GET" && url.pathname === "/connections") {
    return json(res, 200, MOCK_CONNECTIONS)
  }

  // GET /search
  if (req.method === "GET" && url.pathname === "/search") {
    return json(res, 200, [
      { id: "connector_1", name: "Slack", type: "connector" },
    ])
  }

  // GET /actions
  if (req.method === "GET" && url.pathname === "/actions") {
    return json(res, 200, [
      { id: "action_1", name: "send-message", description: "Send a message" },
    ])
  }

  // POST /actions/:id/run
  if (req.method === "POST" && url.pathname.match(/^\/actions\/.*\/run$/)) {
    return json(res, 200, { success: true, output: { result: "ok" } })
  }

  // POST /connection-requests
  if (req.method === "POST" && url.pathname === "/connection-requests") {
    return json(res, 200, {
      id: "req_1",
      url: "https://example.com/auth",
      status: "pending",
    })
  }

  // GET /connection-requests/:id
  if (
    req.method === "GET" &&
    url.pathname.match(/^\/connection-requests\/.*$/)
  ) {
    return json(res, 200, { id: "req_1", status: "success" })
  }

  // POST /agent/sessions
  if (req.method === "POST" && url.pathname === "/agent/sessions") {
    return json(res, 200, { id: "session_1", status: "running" })
  }

  // GET /agent/sessions/:id
  if (
    req.method === "GET" &&
    url.pathname.match(/^\/agent\/sessions\/[^/]+$/)
  ) {
    return json(res, 200, { id: "session_1", status: "idle" })
  }

  // POST /agent/sessions/:id/message
  if (
    req.method === "POST" &&
    url.pathname.match(/^\/agent\/sessions\/[^/]+\/message$/)
  ) {
    return json(res, 200, { id: "session_1", status: "running" })
  }

  // POST /agent/sessions/:id/interrupt
  if (
    req.method === "POST" &&
    url.pathname.match(/^\/agent\/sessions\/[^/]+\/interrupt$/)
  ) {
    return json(res, 200, { id: "session_1", status: "aborted" })
  }

  // Catch-all: echo request back
  let body = ""
  req.on("data", (chunk) => (body += chunk))
  req.on("end", () => {
    json(res, 200, {
      echo: true,
      method: req.method,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams),
      body: body ? JSON.parse(body) : null,
    })
  })
})

server.listen(PORT, () => {
  console.log(`Mock Membrane API listening on port ${PORT}`)
})
