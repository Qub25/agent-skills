export const EXPECTED_TOOL_NAMES = [
  "list-connections",
  "search-connectors",
  "search-tools",
  "run-tool",
  "request-connection",
  "check-connection-result",
  "create-agent-session",
  "get-agent-session",
  "send-agent-message",
  "abort-agent-session",
]

export const EXPECTED_TOOL_COUNT = EXPECTED_TOOL_NAMES.length

export const MOCK_CONFIG = {
  apiKey: process.env.MOCK_API_TOKEN || "test-token",
  apiUrl: process.env.MOCK_API_URL || "http://localhost:3000",
}
