"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/router";
import { CreateChatThread } from "../chat-services/chat-thread-service";
import { useGlobalMessageContext } from "@/features/global-message/global-message-context";

export const NewChat = () => {
  const router = useRouter();
  const { showError } = useGlobalMessageContext();

  const startNewChat = async () => {
    try {
      const newChatThread = await CreateChatThread();
      if (newChatThread) {
        router.push("/chat/" + newChatThread.id);
      }
    } catch (e) {
      console.error("Error starting new chat:", e);
      showError('Failed to start a new chat. Please try again later.');
    }
  };

  return (
    <Button
      className="gap-2 rounded-full w-[40px] h-[40px] p-1 text-primary"
      variant="outline"
      onClick={() => startNewChat()}
    >
      <PlusCircle size={40} strokeWidth={1.2} />
    </Button>
  );
};
