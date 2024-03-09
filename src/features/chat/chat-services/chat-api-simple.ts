import { getTenantId, userHashedId, userSession } from "@/features/auth/helpers"
import { OpenAIInstance } from "@/features/common/openai"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { initAndGuardChatSession } from "./chat-thread-service"
import { CosmosDBChatMessageHistory } from "./cosmosdb/cosmosdb"
import { PromptGPTProps } from "./models"
import { updateChatThreadIfUncategorised } from "./chat-utility"
import { translator } from "./chat-translator-service"

async function buildUserContextPrompt(): Promise<string> {
  const session = await userSession()
  const displayName = session?.name
  const contextPrompt = session?.contextPrompt
  if (!displayName) return ""
  let prompt = `Note, you are chatting to ${displayName}`
  if (contextPrompt && contextPrompt.length > 0) {
    prompt += ` and they have provided the below context: ${contextPrompt}`
  }
  return prompt
}

export const ChatAPISimple = async (props: PromptGPTProps): Promise<Response> => {
  const { updatedLastHumanMessage, chatThread } = await initAndGuardChatSession(props)
  const openAI = OpenAIInstance()
  const userId = await userHashedId()
  const tenantId = await getTenantId()
  const userContextPrompt = await buildUserContextPrompt()

  const chatHistory = new CosmosDBChatMessageHistory({
    chatThreadId: chatThread.id,
    userId: userId,
    tenantId: tenantId,
  })

  await chatHistory.addMessage({
    content: updatedLastHumanMessage.content,
    role: "user",
  })

  const history = await chatHistory.getMessages()
  const topHistory = history.slice(history.length - 30, history.length)

  const systemPrompt =
    process.env.SYSTEM_PROMPT ||
    `-You are QChat who is a helpful AI Assistant developed to assist Queensland government employees in their day-to-day tasks.
    - You will provide clear and concise queries, and you will respond with polite and professional answers.
    - You will answer questions truthfully and accurately.
    - You will respond to questions in accordance with rules of Queensland government.`

  const metaPrompt = systemPrompt + userContextPrompt

  try {
    const response = await openAI.chat.completions.create({
      messages: [{ role: "system", content: metaPrompt }, ...topHistory],
      model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      stream: true,
    })

    const stream = OpenAIStream(response, {
      async onStart() {},
      async onCompletion(completion) {
        try {
          const translatedCompletion = await translator(completion)
          await chatHistory.addMessage({
            content: translatedCompletion,
            role: "assistant",
          })
          await updateChatThreadIfUncategorised(chatThread, translatedCompletion)
        } catch (_translationError) {
          await chatHistory.addMessage({
            content: completion,
            role: "assistant",
          })
        }
      },
    })

    return new StreamingTextResponse(stream, {
      headers: { "Content-Type": "text/event-stream" },
    })
  } catch (e: unknown) {
    const errorResponse = e instanceof Error ? e.message : "An unknown error occurred."
    const errorStatusText = e instanceof Error ? e.toString() : "Unknown Error"

    return new Response(errorResponse, {
      status: 500,
      statusText: errorStatusText,
    })
  }
}
