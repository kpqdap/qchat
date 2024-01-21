import { Message } from "ai";

export const CHAT_DOCUMENT_ATTRIBUTE = "CHAT_DOCUMENT";
export const CHAT_THREAD_ATTRIBUTE = "CHAT_THREAD";
export const MESSAGE_ATTRIBUTE = "CHAT_MESSAGE";

export interface ChatMessageModel {
  id: string;
  createdAt: Date;
  isDeleted: boolean;
  threadId: string;
  userId: string;
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
export type ChatRole = "system" | "user" | "assistant" | "function" | "data" | "tool";
export type ChatSentiment = "neutral" | "positive" | "negative";

export interface ChatThreadModel {
  id: string;
  name: string;
  previousChatName: string;
  chatCategory: string;
  createdAt: Date;
  userId: string;
  useName: string;
  isDeleted: boolean;
  chatType: ChatType;
  conversationSensitivity: ConversationSensitivity;
  conversationStyle: ConversationStyle;
  chatOverFileName: string;
  type: "CHAT_THREAD";
}

export interface PromptGPTBody {
  id: string; // thread id
  chatType: ChatType;
  conversationStyle: ConversationStyle;
  conversationSensitivity: ConversationSensitivity;
  chatOverFileName: string;
}

export interface PromptGPTProps extends PromptGPTBody {
  messages: Message[];
  promptButton : string;
}

export interface ChatDocumentModel {
  id: string;
  name: string;
  chatThreadId: string;
  userId: string;
  isDeleted: boolean;
  createdAt: Date;
  type: "CHAT_DOCUMENT";
}

export interface ServerActionResponse<T> {
  success: boolean;
  error: string;
  response: T;
}
