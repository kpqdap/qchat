import { FC, useState } from "react"
import { useChatContext } from "../chat-context"
import { ChatFileUI } from "../chat-file/chat-file-ui"
import { ChatStyleSelector } from "./chat-style-selector"
import { ChatSensitivitySelector } from "./chat-sensitivity-selector"
import { ChatTypeSelector } from "./chat-type-selector"
import { PromptButton } from "./prompt-buttons-UI"
import { Card } from "@/features/ui/card"
import { EasterEgg } from "./chat-easter-egg"
import { UpsertSelectedPromptButton } from "../../chat-services/chat-thread-service"

interface Prop {}

export const ChatMessageEmptyState: FC<Prop> = () => {
  const { setInput, id } = useChatContext()
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined)

  const handlePromptSelected = async (prompt: string): Promise<void> => {
    setSelectedPrompt(prompt)
    UpsertSelectedPromptButton(prompt, id)
      .finally(() => setInput(prompt))
      .catch(error => {
        console.error("An error occurred on storing the selected prompt button", error)
      })
  }
  const { fileState }: { fileState: { showFileUpload: string } } = useChatContext()
  const { showFileUpload } = fileState

  return (
    <div className="max:h-5/6 container mx-auto grid w-full max-w-3xl grid-cols-5 items-center justify-center gap-9 overflow-auto p-4 pb-[80px]">
      <Card className="col-span-5 flex flex-col gap-2 p-5 ">
        <EasterEgg />
        <div className="flex flex-col gap-1">
          <p className="text-text text-sm">Set the Sensitivity of your chat</p>
          <ChatSensitivitySelector disable={false} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-text text-sm">Choose a conversation style</p>
          <ChatStyleSelector disable={false} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-text text-sm">How would you like to chat?</p>
          <ChatTypeSelector disable={false} />
        </div>
        {showFileUpload === "data" || showFileUpload === "audio" ? (
          <ChatFileUI />
        ) : (
          <div className="flex flex-col gap-1"></div>
        )}
        <div className="flex flex-col gap-1">
          <br />
          <p className="text-text text-sm">Try a suggested starter prompt...</p>
          <PromptButton onPromptSelected={handlePromptSelected} selectedPrompt={selectedPrompt} />
        </div>
      </Card>
    </div>
  )
}
