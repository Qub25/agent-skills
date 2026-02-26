# Membrane Agent Skills

**Give your AI coding agent the power to connect to any API and take action.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-compatible-green.svg)](https://agentskills.io/)

Reusable skills that let [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [Cursor](https://cursor.sh), [GitHub Copilot](https://github.com/features/copilot), [Gemini CLI](https://github.com/google-gemini/gemini-cli), and other AI agents connect to Slack, HubSpot, Salesforce, and 1000+ apps through [Membrane](https://getmembrane.com).

## Available Skills

| Skill | Description |
|---|---|
| [connect-any-api](skills/connect-any-api/) | Connect to any external API and perform actions — Slack, HubSpot, Salesforce, GitHub, Jira, and 1000+ more |
| [build-integrations](skills/build-integrations/) | Add integrations to your product — connection UI, OAuth, actions, data sync, webhooks, and AI agent tools |

## Quick Start

Install all skills:

```bash
npx skills add membranehq/agent-skills
```

Install a specific skill:

```bash
npx skills add membranehq/agent-skills --skill connect-any-api
```

Or using the shorthand:

```bash
npx skills add membranehq/agent-skills@connect-any-api
```

## Setup

All skills require a Membrane account:

1. Sign up at [getmembrane.com](https://getmembrane.com)
2. Get your API token from the [dashboard](https://console.getmembrane.com)
3. Set the environment variable:
   ```bash
   export MEMBRANE_TOKEN="your-token-here"
   ```

Optionally set a custom API URL (defaults to `https://api.getmembrane.com`):

```bash
export MEMBRANE_API_URL="https://your-instance.example.com"
```

## Custom Agent Tools

If you're building a custom agent and need Membrane tools embedded directly in your code, see [`agents/`](agents). Each subdirectory contains a ready-to-run agent example:

| Agent | Framework |
|---|---|
| [openai](agents/openai/) | OpenAI SDK |
| [vercel-ai-sdk](agents/vercel-ai-sdk/) | Vercel AI SDK |
| [langchain](agents/langchain/) | LangChain |
| [opencode](agents/opencode/) | OpenCode Plugin |

Tool definitions live in [`tools/self-integration.ts`](tools/self-integration.ts).

## License

MIT
