import { Message } from "ai";

export const CHAT_DOCUMENT_ATTRIBUTE = "CHAT_DOCUMENT";
export const CHAT_THREAD_ATTRIBUTE = "CHAT_THREAD";
export const MESSAGE_ATTRIBUTE = "CHAT_MESSAGE";

export interface ChatMessageModel {
  id: string;
  createdAt: Date;
  isDeleted: boolean;
  threadId: string;
  userId: string | undefined | void;
  tenantId: string | undefined | void;
  content: string;
  role: ChatRole;
  context: string;
  type: "CHAT_MESSAGE";
  feedback: string;
  sentiment: ChatSentiment;
  reason: string;
  systemPrompt: string;
}

export type ConversationStyle = "creative" | "balanced" | "precise";
export type ConversationSensitivity = "official" | "sensitive" | "protected";
export type ChatType = "simple" | "data" | "mssql";
export type FeedbackType = "harmful / unsafe" | "untrue" | "unhelpful";
export type ChatRole = "system" | "user" | "assistant" | "function";
export type ChatSentiment = "neutral" | "positive" | "negative";

export interface ChatThreadModel {
  id: string;
  name: string;
  previousChatName: string;
  chatCategory: string;
  createdAt: Date;
  userId: string;
  tenantId: string;
  useName: string;
  chatThreadId: string;
  isDeleted: boolean;
  chatType: ChatType;
  conversationSensitivity: ConversationSensitivity;
  conversationStyle: ConversationStyle;
  chatOverFileName: string;
  type: "CHAT_THREAD";
}

export interface PromptGPTBody {
  id: string;
  chatType: ChatType;
  conversationStyle: ConversationStyle;
  conversationSensitivity: ConversationSensitivity;
  chatOverFileName: string;
  tenantId: string;
  userId: string;
}

export interface PromptGPTProps extends PromptGPTBody {
  messages: Message[];
  userId: string;
  tenantId: string;
}

export interface ChatDocumentModel {
  id: string;
  name: string;
  chatThreadId: string;
  userId: string;
  tenantId: string;
  isDeleted: boolean;
  createdAt: Date;
  type: "CHAT_DOCUMENT";
}

export interface ServerActionResponse<T> {
  success: boolean;
  error: string;
  response: T;
}

export interface ChatUtilities {
  promptButton : string;
  // promptSuggestion : string;
}
