import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import ChatLoading from "@/components/chat/chat-loading"
import ChatRow from "@/components/chat/chat-row"
import { useSession } from "next-auth/react"
import { useChatContext } from "./chat-context"
import { ChatHeader } from "./chat-header"
import { ChatRole } from "../chat-services/models"
import { useChatScrollAnchor } from "@/components/hooks/use-chat-scroll-anchor"
import { AI_NAME } from "@/features/theme/customise"

interface Props {
  chatId: string
  sentiment?: string
  chatThreadId: string
  contentSafetyWarning?: string
}

export const ChatMessageContainer: React.FC<Props> = ({ chatId, chatThreadId, sentiment, contentSafetyWarning }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading } = useChatContext()

  useChatScrollAnchor(messages, scrollRef)

  useEffect(() => {
    if (!isLoading) {
      router.refresh()
    }
  }, [isLoading, router])

  return (
    <div className="h-full overflow-y-auto bg-altBackground" ref={scrollRef}>
      <div className="flex justify-center p-4">
        <ChatHeader />
      </div>
      <div className="pb-[80px] flex flex-col justify-end flex-1">
        {messages.map((message, index) => (
          <ChatRow
            chatMessageId={message.id}
            name={message.role === ChatRole.User ? session?.user?.name! : AI_NAME}
            message={message.content}
            type={message.role as ChatRole}
            key={index}
            chatThreads={chatThreadId}
            contentSafetyWarning={contentSafetyWarning}
          />
        ))}
        {isLoading && <ChatLoading />}
      </div>
    </div>
  )
}
