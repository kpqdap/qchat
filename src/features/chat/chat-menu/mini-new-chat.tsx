"use client"

import { Button } from "@/features/ui/button"
import { MessageSquarePlus } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  CreateChatThread,
  FindChatThreadByTitleAndEmpty,
  UpdateChatThreadCreatedAt,
} from "../chat-services/chat-thread-service"
import { useGlobalMessageContext } from "@/features/globals/global-message-context"

export const MiniNewChat = (): JSX.Element => {
  const router = useRouter()
  const { showError } = useGlobalMessageContext()

  const startNewChat = async (): Promise<void> => {
    const title = "New Chat"

    try {
      const existingThread = await FindChatThreadByTitleAndEmpty(title)

      if (existingThread) {
        await UpdateChatThreadCreatedAt(existingThread.id)
        router.push(`/chat/${existingThread.id}`)
      } else {
        const newChatThread = await CreateChatThread()
        if (newChatThread) {
          router.push(`/chat/${newChatThread.id}`)
        }
      }
      router.refresh()
    } catch (_error) {
      showError("Failed to start a new chat. Please try again later.")
    }
  }

  return (
    <div className="absolute right-4 top-4 lg:hidden">
      <Button
        aria-label="Start a new chat"
        role="button"
        tabIndex={0}
        className="size-[40px] gap-2 rounded-md p-1"
        variant="default"
        onClick={startNewChat}
        onKeyDown={e => e.key === "Enter" && startNewChat()}
      >
        <MessageSquarePlus size={40} strokeWidth={1.2} aria-hidden="true" />
      </Button>
    </div>
  )
}
