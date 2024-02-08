"use server";

import "server-only";
import { getTenantId, userHashedId, userSession } from "@/features/auth/helpers";
import { FindAllChats } from "@/features/chat/chat-services/chat-service";
import { uniqueId } from "@/features/common/util";
import { SqlQuerySpec } from "@azure/cosmos";
import { CosmosDBContainer } from "../../common/cosmos";
import { CHAT_THREAD_ATTRIBUTE, ChatMessageModel, ChatThreadModel, ChatType, ChatUtilities, ConversationSensitivity, ConversationStyle, PromptGPTProps } from "./models";

export const FindAllChatThreadForCurrentUser = async () => {
  const container = await CosmosDBContainer.getInstance().getContainer();
  const tenantId = await getTenantId();
  const userId = await userHashedId();
  const partitionKey = [tenantId, userId];

  const querySpec: SqlQuerySpec = {
    query:
      "SELECT * FROM root r WHERE r.type=@type AND r.isDeleted=@isDeleted ORDER BY r.createdAt DESC",
    parameters: [
      {
        name: "@type",
        value: CHAT_THREAD_ATTRIBUTE,
      },
      {
        name: "@isDeleted",
        value: false,
      },
    ],
  };

  const { resources } = await container.items
    .query<ChatThreadModel>(querySpec, {
      partitionKey,
    })
    .fetchAll();

  return resources;
};

export const FindChatThreadByID = async (id: string) => {
  const container = await CosmosDBContainer.getInstance().getContainer();
  const tenantId = await getTenantId();
  const userId = await userHashedId();
  const partitionKey = [tenantId, userId];

  const querySpec: SqlQuerySpec = {
    query:
      "SELECT * FROM root r WHERE r.id=@id AND r.type=@type AND r.isDeleted=@isDeleted",
    parameters: [
      {
        name: "@id",
        value: id,
      },
      {
        name: "@type",
        value: CHAT_THREAD_ATTRIBUTE,
      },
      {
        name: "@isDeleted",
        value: false,
      },
    ],
  };

  const { resources } = await container.items
    .query<ChatThreadModel>(querySpec, {
      partitionKey,
    })
    .fetchAll();

  return resources;
};

export const RenameChatThreadByID = async (
  chatThreadID: string, 
  newTitle: string| Promise<string> | null
  ) => {
  const container = await CosmosDBContainer.getInstance().getContainer();
  const threads = await FindChatThreadByID(chatThreadID);

  if (threads.length !== 0) {
    threads.forEach(async (thread) => {
      const itemToUpdate = {
        ...thread,
        name: newTitle, // Update the name property with the new title.
      };
      await container.items.upsert(itemToUpdate);
    });
  }
};

export const EnsureChatThreadIsForCurrentUser = async (
  chatThreadID: string
) => {
  const modelToSave = await FindChatThreadByID(chatThreadID);
  if (modelToSave.length === 0) {
    throw new Error("Chat thread not found");
  }

  return modelToSave[0];
};

export const UpsertChatThread = async (chatThread: ChatThreadModel) => {
  const container = await CosmosDBContainer.getInstance().getContainer();
  const updatedChatThread = await container.items.upsert<ChatThreadModel>(
    chatThread
  );

  if (updatedChatThread === undefined) {
    throw new Error("Chat thread not found");
  }

  return updatedChatThread;
};

export const UpsertPromptButton = async (prompt: string) => {
  const container = await CosmosDBContainer.getInstance().getContainer();
  const updatedChatPrompts = await container.items.upsert<ChatUtilities>({
    promptButton: prompt,
    // promptSuggestion : "",
  });
  if (updatedChatPrompts === undefined) {
    throw new Error("Prompt Button not selected");
  }
};


export const updateChatThreadTitle = async (
  chatThread: ChatThreadModel,
  messages: ChatMessageModel[],
  chatType: ChatType,
  conversationStyle: ConversationStyle,
  conversationSensitivity: ConversationSensitivity,
  chatOverFileName: string,
  userMessage: string
) => {
  if (messages.length === 0) {
    const updatedChatThread = await UpsertChatThread({
      ...chatThread,
      chatType: chatType,
      chatCategory: "Uncategorised",
      chatOverFileName: chatOverFileName,
      conversationStyle: conversationStyle,
      conversationSensitivity: conversationSensitivity,
      name : "New Chat",
      previousChatName : ""
    });

    return updatedChatThread.resource!;
  }
  
  return chatThread;
};

export const CreateChatThread = async () => {
  const id = uniqueId();
  const modelToSave: ChatThreadModel = {
    name: "New Chat",
    previousChatName : "",
    chatCategory: "Uncategorised",
    useName: (await userSession())!.name,
    userId: await userHashedId(),
    id: id,
    chatThreadId: id,
    tenantId: await getTenantId(),
    createdAt: new Date(),
    isDeleted: false,
    chatType: "simple",
    conversationStyle: "precise",
    conversationSensitivity: "official",
    type: CHAT_THREAD_ATTRIBUTE,
    chatOverFileName: "",
  };

  const container = await CosmosDBContainer.getInstance().getContainer();
  const response = await container.items.create<ChatThreadModel>(modelToSave);
  return response.resource;
};

export const initAndGuardChatSession = async (props: PromptGPTProps) => {
  const { messages, id, chatType, conversationStyle, conversationSensitivity, chatOverFileName } = props;

  //last message
  const lastHumanMessage = messages[messages.length - 1];

  const currentChatThread = await EnsureChatThreadIsForCurrentUser(id);
  const chats = await FindAllChats(id);

  const chatThread = await updateChatThreadTitle(
    currentChatThread,
    chats,
    chatType,
    conversationStyle,
    conversationSensitivity,
    chatOverFileName,
    lastHumanMessage.content
  );

  return {
    id,
    lastHumanMessage,
    chats,
    chatThread,
  };
};

export const FindChatThreadByTitleAndEmpty = async (title: string): Promise<ChatThreadModel | undefined> => {
  const container = await CosmosDBContainer.getInstance().getContainer();

  const querySpec = {
    query:
      "SELECT * FROM root r WHERE r.type=@type AND r.userId=@userId AND r.name=@name AND r.isDeleted=@isDeleted",
    parameters: [
      {
        name: "@type",
        value: CHAT_THREAD_ATTRIBUTE,
      },
      {
        name: "@name",
        value: title,
      },
      {
        name: "@isDeleted",
        value: false,
      },
      {
        name: "@userId",
        value: await userHashedId(),
      },
    ],
  };

  const { resources } = await container.items.query<ChatThreadModel>(querySpec).fetchAll();

  for (const chatThread of resources) {
    const messages = await FindAllChats(chatThread.id);

    if (messages.length === 0) {
      return chatThread;
    }
  }

  return undefined;
};
