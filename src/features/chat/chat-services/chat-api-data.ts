import { getTenantId, userHashedId } from "@/features/auth/helpers"
import { OpenAIInstance } from "@/features/common/services/open-ai"
import { AI_NAME } from "@/features/theme/theme-config"
import { OpenAIStream, StreamingTextResponse } from "ai"
import { AzureCogDocumentIndex, similaritySearchVectorWithScore } from "./azure-cog-search/azure-cog-vector-store"
import { initAndGuardChatSession } from "./chat-thread-service"
import { CosmosDBChatMessageHistory } from "./cosmosdb/cosmosdb"
import { PromptGPTProps } from "./models"
import { updateChatThreadIfUncategorised } from "./chat-utility"
import { DocumentSearchModel } from "./azure-cog-search/azure-cog-vector-store"

const SYSTEM_PROMPT = `You are ${AI_NAME} who is a helpful AI Assistant.`
const CONTEXT_PROMPT = ({ context, userQuestion }: { context: string; userQuestion: string }): string => {
  return `
- Given the following extracted parts of a document, create a final answer. \n
- If you don't know the answer, just say that you don't know. Don't try to make up an answer.\n
- You must always include a citation at the end of your answer and don't include full stop.\n
- Use the format for your citation {% citation items=[{name:"filename 1", id:"file id", order:"1"}, {name:"filename 2", id:"file id", order:"2"}] /%}\n 
----------------\n 
context:\n 
${context}
----------------\n 
question: ${userQuestion}`
}

export const ChatAPIData = async (props: PromptGPTProps): Promise<Response> => {
  const { chatThreadId, updatedLastHumanMessage, chatThread } = await initAndGuardChatSession(props)

  const openAI = OpenAIInstance()
  const userId = await userHashedId()
  const tenantId = await getTenantId()
  const chatHistory = new CosmosDBChatMessageHistory({
    chatThreadId: chatThreadId,
    userId: userId,
    tenantId: tenantId,
  })

  const history = await chatHistory.getMessages()
  const topHistory = history.slice(history.length - 30, history.length)

  const relevantDocuments = await findRelevantDocuments(updatedLastHumanMessage.content, chatThreadId)

  const context = relevantDocuments
    .map((result, index) => {
      const content = result.pageContent.replace(/(\r\n|\n|\r)/gm, "")
      const context = `[${index}]. file name: ${result.metadata} \n file id: ${result.id} \n order: ${result.order} \n ${content}`
      return context
    })
    .join("\n------\n")

  try {
    const response = await openAI.chat.completions.create({
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        ...topHistory,
        {
          role: "user",
          content: CONTEXT_PROMPT({
            context,
            userQuestion: updatedLastHumanMessage.content,
          }),
        },
      ],
      model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      stream: true,
    })

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await chatHistory.addMessage({
          content: updatedLastHumanMessage.content,
          role: "user",
        })

        await chatHistory.addMessage(
          {
            content: completion,
            role: "assistant",
          },
          context
        )

        await updateChatThreadIfUncategorised(chatThread, completion)
      },
    })

    return new StreamingTextResponse(stream, {
      headers: { "Content-Type": "text/event-stream" },
    })
  } catch (e: unknown) {
    if (e instanceof Error) {
      return new Response(e.message, {
        status: 500,
        statusText: e.toString(),
      })
    } else {
      return new Response("An unknown error occurred.", {
        status: 500,
        statusText: "Unknown Error",
      })
    }
  }
}

const findRelevantDocuments = async (
  query: string,
  chatThreadId: string
): Promise<(AzureCogDocumentIndex & DocumentSearchModel)[]> => {
  const userId = await userHashedId()
  const tenantId = await getTenantId()
  const relevantDocuments = await similaritySearchVectorWithScore(query, 10, userId, chatThreadId, tenantId)

  return relevantDocuments
}
