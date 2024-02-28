"use client";

import { Button } from "@/features/ui/button";
import { MessageSquarePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateChatThread } from "../chat-services/chat-thread-service";
import { useGlobalMessageContext } from "@/features/global-message/global-message-context";

export const NewChat = () => {
  const router = useRouter();
  const { showError } = useGlobalMessageContext();

  const startNewChat = async () => {
    try {
      const newChatThread = await CreateChatThread();
      if (newChatThread) {
        router.push(`/chat/${newChatThread.id}`);
      }
    } catch (e) {
      console.error(e);
      showError('Failed to start a new chat. Please try again later.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      startNewChat();
    }
  };

  return (
    <Button
      className="gap-2 rounded-md w-[40px] h-[40px] p-1"
      variant="default"
      onClick={startNewChat}
      aria-label="Start a new chat"
      onKeyDown={handleKeyDown}
    >
      <MessageSquarePlus size={40} strokeWidth={1.2} />
    </Button>
  );
};
