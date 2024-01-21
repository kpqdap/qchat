import { FindAllChats, UpsertChat } from "@/features/chat/chat-services/chat-service";
import { ChatMessageModel, MESSAGE_ATTRIBUTE } from "@/features/chat/chat-services/models";
import { CosmosDBContainer } from "@/features/common/cosmos";
import { uniqueId } from "@/features/common/util";
import { ChatCompletionMessage } from "openai/resources";

export interface CosmosDBChatMessageHistoryFields {
  sessionId: string;
  userId: string;
}

export class CosmosDBChatMessageHistory {
  private sessionId: string;
  private userId: string;

  constructor({ sessionId, userId }: CosmosDBChatMessageHistoryFields) {
    this.sessionId = sessionId;
    this.userId = userId;
  }

  async getMessages(): Promise<ChatCompletionMessage[]> {
    const chats = await FindAllChats(this.sessionId);
    return mapOpenAIChatMessages(chats);
  }

  async clear(): Promise<void> {
    const container = await CosmosDBContainer.getInstance().getContainer();
    await container.delete();
  }

  async addMessage(message: ChatCompletionMessage, citations: string = "") {
    const modelToSave: ChatMessageModel = {
      id: uniqueId(),
      createdAt: new Date(),
      type: MESSAGE_ATTRIBUTE,
      isDeleted: false,
      content: message.content ?? "",
      role: message.role,
      threadId: this.sessionId,
      userId: this.userId,
      context: citations,
      systemPrompt: process.env.System_Prompt! ,
      feedback: "",
      sentiment: "neutral",
      reason: "",
    };

    await UpsertChat(modelToSave);
  }
}

function mapOpenAIChatMessages(
  messages: ChatMessageModel[]
    ): ChatCompletionMessage[] {
      return messages.map((message) => {
        let role: "system" | "user" | "assistant" | "data";
        if (message.role === "function") {
          role = "assistant";
        } else {
          role = message.role as "user" | "assistant" | "system" | "data";
        }
        return {
          role: role as "system" | "user" | "assistant",
          content: message.content,
        };
      });
    }
