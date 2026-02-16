import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { toVercelTools } from "./self-integration-tools"

const config = { apiKey: process.env.MEMBRANE_TOKEN! }

const { text } = await generateText({
  model: openai("gpt-4o"),
  tools: toVercelTools(config),
  maxSteps: 10,
  prompt: "List my connections",
})

console.log(text)
