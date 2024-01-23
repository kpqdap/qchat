"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateChatThread, FindChatThreadByTitleAndEmpty } from "../chat-services/chat-thread-service";

export const NewChat = async (): Promise<JSX.Element> => {
  const router = useRouter();

  const startNewChat = async () => {
    try {
      const existingChatThread = await FindChatThreadByTitleAndEmpty("New Chat");

      if (existingChatThread) {
        router.push("/chat/" + existingChatThread.id);
      } else {
        const newChatThreadResponse = await CreateChatThread();
        if (newChatThreadResponse && 'resource' in newChatThreadResponse) {
          router.push("/chat/" + newChatThreadResponse.id);
        } else {
          console.error("Failed to create a new chat thread.");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button
      className="gap-2 rounded-full w-[40px] h-[40px] p-1 text-primary"
      variant={"outline"}
      onClick={() => startNewChat()}
    >
      <PlusCircle size={40} strokeWidth={1.2} />
    </Button>
  );
};
