"use server"
import "server-only"
import { OpenAIInstance } from "@/features/common/openai"
import { CosmosDBContainer } from "@/features/common/cosmos"
import { getTenantId, userHashedId } from "@/features/auth/helpers"
import { translator } from "./chat-translator-service"

export interface Message {
  role: "function" | "system" | "user" | "assistant"
  content: string
}

interface GenericChatAPIProps {
  messages: Message[]
}

async function logAPIUsage(apiName: string, apiParams: any, apiResult: any): Promise<void> {
  const container = await CosmosDBContainer.getInstance().getContainer()
  const tenantId = await getTenantId()
  const userId = await userHashedId()
  const { prompt_tokens, completion_tokens, total_tokens } = apiResult.usage
  const uniqueId = `api-${Date.now()}-${tenantId}-${userId}`
  const logEntry = {
    id: uniqueId,
    apiName,
    tenantId,
    userId,
    createdAt: new Date(),
    params: apiParams,
    result: apiResult,
    promptTokens: prompt_tokens,
    completionTokens: completion_tokens,
    totalTokens: total_tokens,
    type: "CHAT_UTILITY",
  }

  await container.items.create(logEntry)
}

export const GenericChatAPI = async (apiName: string, props: GenericChatAPIProps): Promise<string | null> => {
  const openAI = OpenAIInstance()
  try {
    const messageResponse = await openAI.chat.completions.create({
      messages: props.messages,
      model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    })
    await logAPIUsage(apiName, { messages: props.messages }, messageResponse)

    const content = messageResponse.choices[0]?.message?.content
    if (content === undefined || content === null) {
      throw new Error("No content found in the response from OpenAI API.")
    }

    const translatedContent = await translator(content)
    return translatedContent
  } catch (e) {
    await logAPIUsage("GenericChatAPI", { messages: props.messages }, { error: (e as Error).message })
    throw e
  }
}
