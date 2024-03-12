import React, { FormEvent, useEffect, useRef } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button } from "@/features/ui/button"
import { Menu, File, Clipboard, Bird } from "lucide-react"
import { Message } from "ai"
import { toast } from "@/features/ui/use-toast"
import { AI_NAME } from "@/features/theme/theme-config"
import { getSession } from "next-auth/react"

interface ChatInputMenuProps {
  onDocExport: () => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  setInput: (input: string) => void
  messageCopy: Message[]
}

const ChatInputMenu: React.FC<ChatInputMenuProps> = ({ onDocExport, handleSubmit, setInput, messageCopy }) => {
  const firstMenuItemRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (firstMenuItemRef.current) {
      firstMenuItemRef.current.focus()
    }
  }, [])

  const fairClickHandler = () => {
    const fairInput = "Help me complete a Queensland Government Fast AI Risk Assessment (FAIRA)"
    setInput(fairInput)
    setTimeout(() => {
      const syntheticEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>
      handleSubmit(syntheticEvent)
    }, 0)
  }

  const copyToClipboard = async (): Promise<void> => {
    const getNameInline = async (): Promise<string> => {
      const session = await getSession()
      const name = session?.user?.name || "You"
      return name
    }

    const formattedMessages = await Promise.all(
      messageCopy.map(async message => {
        const author = message.role === "system" || message.role === "assistant" ? "AI" : await getNameInline()
        return `${author}: ${message.content}`
      })
    ).then(messages => messages.join("\n"))

    const messagesWithAttribution = formattedMessages + ("\nConversation generated by " + AI_NAME)

    navigator.clipboard
      .writeText(messagesWithAttribution)
      .then(() => toast({ title: "Success", description: "Messages copied to clipboard" }))
      .catch(_err => toast({ title: "Error", description: "Failed to copy messages to clipboard" }))
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          aria-haspopup="true"
          aria-expanded="false"
          aria-controls="chat-input-options"
          aria-label="Open chat input options menu"
          type="button"
          variant="ghost"
          size="icon"
        >
          <Menu aria-hidden="true" focusable="false" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          id="chat-input-options"
          role="menu"
          aria-label="Chat input options"
          className="bg-background text-popover-foreground min-w-[220px] rounded-md p-[5px] shadow-lg"
          sideOffset={5}
        >
          <DropdownMenu.Item
            asChild
            onSelect={fairClickHandler}
            className="DropdownMenuItem bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground cursor-pointer rounded-md"
          >
            <div tabIndex={0} ref={firstMenuItemRef} style={{ display: "flex", alignItems: "center", padding: "5px" }}>
              <Bird size={20} className="mr-2" aria-hidden="true" />
              Complete a Fast AI Risk Assessment
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="bg-secondary my-2 h-px" />
          <DropdownMenu.Item asChild onSelect={onDocExport} className="dropdown-menu-item">
            <div
              tabIndex={0}
              className="hover:bg-secondary hover:text-secondary-foreground flex cursor-pointer items-center rounded-md p-2"
            >
              <File size={20} className="mr-2" aria-hidden="true" />
              Export your Chat to File
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="bg-secondary my-2 h-px" />
          <DropdownMenu.Item asChild onSelect={copyToClipboard} className="dropdown-menu-item">
            <div
              tabIndex={0}
              className="hover:bg-secondary hover:text-secondary-foreground flex cursor-pointer items-center rounded-md p-2"
            >
              <Clipboard size={20} className="mr-2" aria-hidden="true" />
              Copy Chat to Clipboard
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default ChatInputMenu
