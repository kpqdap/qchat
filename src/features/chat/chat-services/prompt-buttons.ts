"use server"
import "server-only"
import { GenericChatAPI } from "./generic-chat-api"

function getBooleanEnv(variable: string): boolean {
  return process.env[variable]?.toLowerCase() === "true"
}

export const PromptButtons = async (): Promise<string[]> => {
  const apiName = "generatePromptButtons"
  const defaultPrompts = ["Write a Ministerial Briefing Note", "Provide a summary of the below text"]

  if (!getBooleanEnv("PROMPT_BUTTON_ENABLED")) {
    return defaultPrompts
  }

  try {
    const promptButtons = await GenericChatAPI(apiName, {
      messages: [
        {
          role: "system",
          content: ` - create 2 different succinct prompt button suggestions, limited to ten words, for Queensland government employees:
        - this prompt will have some suggestions similar to the below examples:
          " Write a Ministerial Briefing Note "
          " Write a response to a ... "
          " Rewrite this in layman terms "
          " Provide a summary of the below text "
        - provide response as an array only, must be in format: ["Prompt1", "Prompt2"]`,
        },
      ],
    })
    const prompts = JSON.parse(promptButtons as unknown as string) as string[]

    if (!Array.isArray(prompts) || prompts.some(prompt => typeof prompt !== "string")) {
      console.error("Error: Unexpected prompt button structure from API.")
      return defaultPrompts
    }

    const filteredPrompts = prompts.filter(prompt => typeof prompt === "string")
    return filteredPrompts.length > 0 ? filteredPrompts : defaultPrompts
  } catch (error) {
    console.error(`An error occurred: ${error}`)
    return defaultPrompts
  }
}
