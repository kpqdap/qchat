import React, { useEffect, useRef } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button } from "@/features/ui/button"
import { Menu, File, Clipboard, Bird } from "lucide-react"
import { Message } from "ai"
import { useToast } from "@/features/ui/use-toast"
import { getSession } from "next-auth/react"
import { useChatContext } from "@/features/chat/chat-ui/chat-context"

interface ChatInputMenuProps {
  onDocExport: () => void
  messageCopy: Message[]
}

const ChatInputMenu: React.FC<ChatInputMenuProps> = ({ onDocExport }) => {
  const { setInput, handleSubmit, messages } = useChatContext()
  const firstMenuItemRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (firstMenuItemRef.current) {
      firstMenuItemRef.current.focus()
    }
  }, [])

  const fairClickHandler = (): void => {
    const fairInput = "Help me complete a Queensland Government Fast AI Risk Assessment (FAIRA)"
    setInput(fairInput)
    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
    }, 0)
  }

  const copyToClipboard = async (): Promise<void> => {
    try {
      const session = await getSession()
      const name = session?.user?.name || "You"

      const formattedMessages = messages
        .map(message => {
          const author = message.role === "system" || message.role === "assistant" ? "AI" : name
          return `${author}: ${message.content}`
        })
        .join("\n")

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(formattedMessages)
        toast({ title: "Success", description: "Messages copied to clipboard" })
      } else {
        throw new Error("Clipboard API not available")
      }
    } catch (_error) {
      toast({ title: "Error", description: "Failed to copy messages to clipboard" })
    }
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
          className="min-w-[220px] rounded-md bg-background p-[5px] text-popover-foreground shadow-lg"
          sideOffset={5}
        >
          <DropdownMenu.Item
            asChild
            onSelect={fairClickHandler}
            className="DropdownMenuItem cursor-pointer rounded-md bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground"
          >
            <div tabIndex={0} ref={firstMenuItemRef} style={{ display: "flex", alignItems: "center", padding: "5px" }}>
              <Bird size={20} className="mr-2" aria-hidden="true" />
              Complete a Fast AI Risk Assessment
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-2 h-px bg-secondary" />
          <DropdownMenu.Item asChild onSelect={onDocExport} className="dropdown-menu-item">
            <div
              tabIndex={0}
              className="flex cursor-pointer items-center rounded-md p-2 hover:bg-secondary hover:text-secondary-foreground"
            >
              <File size={20} className="mr-2" aria-hidden="true" />
              Export your Chat to File
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-2 h-px bg-secondary" />
          <DropdownMenu.Item asChild onSelect={copyToClipboard} className="dropdown-menu-item">
            <div
              tabIndex={0}
              className="flex cursor-pointer items-center rounded-md p-2 hover:bg-secondary hover:text-secondary-foreground"
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
