"use server"
import "server-only"
import { OpenAIInstance } from "@/features/common/services/open-ai"
import { getTenantId, userHashedId } from "@/features/auth/helpers"
import { translator } from "./chat-translator-service"
import { ItemDefinition } from "@azure/cosmos"
import { CHAT_UTILITY_ATTRIBUTE } from "../constants"
import { HistoryContainer } from "@/features/common/services/cosmos"

export interface Message {
  role: "function" | "system" | "user" | "assistant"
  content: string
}

interface GenericChatAPIProps {
  messages: Message[]
}

async function logAPIUsage<T>(apiName: string, apiParams: unknown, apiResult: T): Promise<void> {
  const [userId, tenantId] = await Promise.all([userHashedId(), getTenantId()])
  const uniqueId = `api-${Date.now()}-${tenantId}-${userId}`
  const usage = (
    apiResult as {
      usage?: {
        completion_tokens?: number
        prompt_tokens?: number
        total_tokens?: number
      }
    }
  )?.usage
  const logEntry: ItemDefinition = {
    id: uniqueId,
    apiName,
    tenantId,
    userId,
    createdAt: new Date(),
    params: apiParams,
    result: apiResult,
    promptTokens: usage?.prompt_tokens,
    completionTokens: usage?.completion_tokens,
    totalTokens: usage?.total_tokens,
    type: CHAT_UTILITY_ATTRIBUTE,
  }
  const container = await HistoryContainer()
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
    if (content === undefined || content === null) throw new Error("No content found in the response from OpenAI API.")

    const translatedContent = await translator(content)
    if (translatedContent.status !== "OK") throw translatedContent
    return translatedContent.response
  } catch (e) {
    await logAPIUsage("GenericChatAPI", { messages: props.messages }, { error: (e as Error).message })
    throw e
  }
}
