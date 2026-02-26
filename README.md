# Membrane Agent Skills

**Give your AI coding agent the power to connect to any API and take action.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-compatible-green.svg)](https://agentskills.io/)

Reusable skills that let AI coding agents connect to Slack, HubSpot, Salesforce, GitHub, Jira, Google Sheets, and 1000+ apps through [Membrane](https://getmembrane.com). Built on the open [Agent Skills](https://agentskills.io/) specification.

## Why Membrane Agent Skills?

- **Any app, any action** — Connect to 1000+ APIs out of the box. If a connector doesn't exist, Membrane's AI agent builds one for you on the fly.
- **Works with your agent** — Drop-in support for Claude Code, Cursor, GitHub Copilot, Gemini CLI, OpenClaw, and any agent that supports the Agent Skills spec.
- **Two skills, two use cases** — Use `connect-any-api` to let your agent talk to apps directly. Use `build-integrations` when you're building a product that needs integration features.
- **Auth handled for you** — OAuth flows, API keys, token refresh — Membrane manages credentials so your agent doesn't have to.

## How It Works

Your agent learns a simple 3-step workflow:

```
1. Connect    →  Authenticate with any external app (Slack, HubSpot, Jira, etc.)
2. Find       →  Search for the right action by describing what you want in natural language
3. Act        →  Execute the action with typed inputs and get structured output
```

No API docs to read. No SDKs to install. Just tell your agent what you want and it figures out the rest.

## Available Skills

### `connect-any-api`

**For users and agents.** Install this skill and your AI agent can connect to any external app and take actions on your behalf — send Slack messages, create Jira tickets, update HubSpot contacts, push to GitHub, and more.

```bash
npx skills add membranehq/agent-skills@connect-any-api
```

**Example:** You tell your agent *"send a message to #general on Slack saying the deploy is done"* — the agent authenticates with Slack (if not already connected), finds the right action, and sends the message. No code written, no API wrangling.

---

### `build-integrations`

**For developers building products.** This skill teaches your coding agent how to add integration features to your app — connection UI for your users, OAuth flows, running actions on their behalf, syncing data, handling webhooks, and exposing integrations as AI agent tools.

```bash
npx skills add membranehq/agent-skills@build-integrations
```

**Covers:** JavaScript SDK, React SDK, REST API, frontend connection UI, backend token generation, data collections, flows, and MCP server setup.

---

## Compatible Agents

| Agent | Status |
|---|---|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | Fully supported |
| [Cursor](https://cursor.sh) | Fully supported |
| [GitHub Copilot](https://github.com/features/copilot) | Fully supported |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Fully supported |
| [OpenClaw](https://github.com/nicepkg/openclaw) | Fully supported |
| Any [Agent Skills](https://agentskills.io/) compatible agent | Fully supported |

## Quick Start

Install all skills:

```bash
npx skills add membranehq/agent-skills
```

Install a specific skill:

```bash
npx skills add membranehq/agent-skills --skill connect-any-api
```

## Setup

All skills require a Membrane account:

1. Sign up at [getmembrane.com](https://getmembrane.com)
2. Get your API token from the [dashboard](https://console.getmembrane.com)
3. Set the environment variable:
   ```bash
   export MEMBRANE_TOKEN="your-token-here"
   ```

## Custom Agent Tools

Building a custom agent? You can embed Membrane tools directly in your code instead of using skills. See [`agents/`](agents) for ready-to-run examples:

| Framework | Example |
|---|---|
| [OpenAI SDK](agents/openai/) | Function calling with Membrane tools |
| [Vercel AI SDK](agents/vercel-ai-sdk/) | Streaming agent with tool use |
| [LangChain](agents/langchain/) | LangChain agent with Membrane tools |
| [OpenCode](agents/opencode/) | OpenCode plugin integration |

Tool definitions: [`tools/self-integration.ts`](tools/self-integration.ts)

## Resources

- [Membrane Console](https://console.getmembrane.com) — Dashboard for managing workspaces, connections, and API tokens
- [Membrane Docs](https://getmembrane.com) — Full documentation
- [Agent Skills Spec](https://agentskills.io/) — The open specification these skills are built on

## License

MIT
