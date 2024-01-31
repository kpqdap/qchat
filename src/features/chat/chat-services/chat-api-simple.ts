import { getTenantId, userHashedId } from "@/features/auth/helpers";
import { OpenAIInstance } from "@/features/common/openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { initAndGuardChatSession } from "./chat-thread-service";
import { CosmosDBChatMessageHistory } from "./cosmosdb/cosmosdb";
import { PromptGPTProps } from "./models";

export const ChatAPISimple = async (props: PromptGPTProps) => {

  const { lastHumanMessage, chatThread } = await initAndGuardChatSession(props);

  const openAI = OpenAIInstance();

  const userId = await userHashedId();

  const tenantId = await getTenantId();

  const chatHistory = new CosmosDBChatMessageHistory({
    sessionId: chatThread.id,
    userId: userId,
    tenantId: tenantId
  });

  await chatHistory.addMessage({
    content: lastHumanMessage.content,
    role: "user",
  });

  const history = await chatHistory.getMessages();
  const topHistory = history.slice(history.length - 30, history.length);

  const systemPrompt: string = process.env.SYSTEM_PROMPT || `-You are QChat who is a helpful AI Assistant developed to assist Queensland government employees in their day-to-day tasks. 
   - You will provide clear and concise queries, and you will respond with polite and professional answers.
   - You will answer questions truthfully and accurately.
   - You will respond to questions in accordance with rules of Queensland government.`;

  try {

    const response = await openAI.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
         },
        ...topHistory,
      ],
      model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      stream: true,
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        try {
          await chatHistory.addMessage({
            content: completion,
            role: "assistant",
          });
        } catch (e) {
          console.log(e)
        }
      }
    });

    return new StreamingTextResponse(stream);
  } catch (e: unknown) {
    const customErrorName = "ChatAPIError";
    console.log(e)

    const errorResponse = e instanceof Error ? e.message : "An unknown error occurred.";
    const errorStatusText = e instanceof Error ? e.toString() : "Unknown Error";

    return new Response(errorResponse, {
      status: 500,
      statusText: errorStatusText,
    });
  }
};
