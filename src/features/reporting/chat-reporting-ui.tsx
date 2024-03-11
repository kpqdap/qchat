import ChatRow from "@/components/chat/chat-row"
import { Card } from "@/features/ui/card"
import { FC } from "react"
import { AI_NAME } from "../theme/customise"
import { FindAllChatsInThread, FindChatThreadByID } from "./reporting-service"
import { ChatRole } from "../chat/chat-services/models"

interface Props {
  chatId: string
  sentiment?: string
  chatThreadId: string
  contentSafetyWarning?: string
}

export const ChatReportingUI: FC<Props> = async props => {
  const chatThreads = await FindChatThreadByID(props.chatId)
  const chats = await FindAllChatsInThread(props.chatId)
  const chatThread = chatThreads[0]

  return (
    <Card className="h-full relative">
      <div className="h-full rounded-md overflow-y-auto">
        <div className="flex justify-center p-4"></div>
        <div className=" pb-[80px] ">
          {chats.map((message, index) => {
            return (
              <ChatRow
                name={message.role === ChatRole.User ? chatThread.useName : AI_NAME}
                message={message.content}
                type={message.role}
                key={index}
                chatMessageId={chatThread.id}
                chatThreads={props.chatId}
                contentSafetyWarning={props.contentSafetyWarning}
              />
            )
          })}
        </div>
      </div>
    </Card>
  )
}
