"use client";

import { FC } from "react";
import { useChatContext } from "./chat-context";
import { ChatMessageEmptyState } from "./chat-empty-state/chat-message-empty-state";
import ChatInput from "./chat-input/chat-input";
import { ChatMessageContainer } from "./chat-message-container";

interface Prop {}

export const ChatUI: FC<Prop> = () => {
  const { messages } = useChatContext();

  return (
    <div className="h-full relative overflow-hidden flex-1 bg-altBackground shadow-md text-text sm:text-lg lg:text-xl">
    {messages.length !== 0 ? (
      <ChatMessageContainer/>
    ) : (
      <ChatMessageEmptyState/>
    )}

    <ChatInput />

  </div>

  );
};

