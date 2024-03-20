import { getTenantId } from "@/features/auth/helpers"
import { ChatMessageModel, ChatThreadModel } from "@/features/chat/models"
import { ServerActionResponseAsync } from "../common/server-action-response"
import { CHAT_THREAD_ATTRIBUTE, DEFAULT_DAYS_AGO } from "../chat/constants"
import { xDaysAgo } from "../common/date-helper"
import { HistoryContainer } from "../common/services/cosmos"
import { SqlQuerySpec } from "@azure/cosmos"

export const FindAllChatThreadsForReporting = async (
  pageSize = 10,
  pageNumber = 0
): ServerActionResponseAsync<ChatThreadModel[]> => {
  try {
    const tenantId = await getTenantId()
    const query: SqlQuerySpec = {
      query: `SELECT *
      FROM root r 
      WHERE r.type=@type AND r.tenantId=@tenantId AND r.createdAt >= @sevenDaysAgo 
      AND r.isDeleted=@isDeleted
      ORDER BY r.createdAt DESC 
      OFFSET ${pageNumber * pageSize} LIMIT ${pageSize}`,
      parameters: [
        { name: "@type", value: CHAT_THREAD_ATTRIBUTE },
        { name: "@isDeleted", value: false },
        { name: "@tenantId", value: tenantId },
        { name: "@sevenDaysAgo", value: xDaysAgo(DEFAULT_DAYS_AGO) },
      ],
    }
    const container = await HistoryContainer()
    const { resources } = await container.items.query<ChatThreadModel>(query, { maxItemCount: pageSize }).fetchNext()
    return {
      status: "OK",
      response: resources,
    }
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    }
  }
}

export const FindChatThreadById = async (chatThreadId: string): ServerActionResponseAsync<ChatThreadModel> => {
  try {
    const tenantId = await getTenantId()
    const query: SqlQuerySpec = {
      query: "SELECT * FROM root r WHERE r.type=@type AND r.tenantId=@tenantId AND r.id=@id",
      parameters: [
        { name: "@type", value: CHAT_THREAD_ATTRIBUTE },
        { name: "@tenantId", value: tenantId },
        { name: "@id", value: chatThreadId },
      ],
    }
    const container = await HistoryContainer()
    const { resources } = await container.items.query<ChatThreadModel>(query).fetchAll()
    return {
      status: "OK",
      response: resources[0],
    }
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    }
  }
}

export const FindAllChatsInThread = async (chatThreadId: string): ServerActionResponseAsync<ChatMessageModel[]> => {
  try {
    const tenantId = await getTenantId()
    const query: SqlQuerySpec = {
      query: "SELECT * FROM root r WHERE r.type=@type AND r.tenantId=@tenantId AND r.chatThreadId = @chatThreadId",
      parameters: [
        { name: "@type", value: CHAT_THREAD_ATTRIBUTE },
        { name: "@tenantId", value: tenantId },
        { name: "@chatThreadId", value: chatThreadId },
      ],
    }
    const container = await HistoryContainer()
    const { resources } = await container.items.query<ChatMessageModel>(query).fetchAll()
    return {
      status: "OK",
      response: resources,
    }
  } catch (error) {
    return {
      status: "ERROR",
      errors: [{ message: `${error}` }],
    }
  }
}
