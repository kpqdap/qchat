"use client"
import React, { FC, useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGlobalMessageContext } from "@/features/globals/global-message-context"
import { Button } from "@/features/ui/button"
import { MenuItem } from "@/components/menu"
import { FileText, MessageCircle, Trash, Pencil, AudioLines } from "lucide-react"
import { ChatThreadModel } from "../chat-services/models"
import { RenameChatThreadByID, SoftDeleteChatThreadByID } from "@/features/chat/chat-services/chat-thread-service"
import Typography from "@/components/typography"

interface Prop {
  menuItems: Array<ChatThreadModel>
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (newTitle: string) => void
  focusAfterClose: HTMLButtonElement | null
}

const PopupMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="popup-message" role="alert">
    <p>{message}</p>
  </div>
)

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, focusAfterClose }): JSX.Element => {
  const [newName, setNewName] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    } else if (focusAfterClose) {
      focusAfterClose.focus()
    }
  }, [isOpen, focusAfterClose])

  const handleSave = (): void => {
    onSave(newName)
    onClose()
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 2000)
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? "block" : "hidden"}`}
    >
      <div className="bg-altBackground w-full max-w-lg mx-auto rounded-lg p-4 overflow-hidden">
        <div className="mb-4">
          <Typography variant="h4" className="text-foreground">
            Edit Chat Name
          </Typography>
        </div>
        <div className="mb-4">
          <label htmlFor="newChatName" className="block text-sm font-medium text-foreground">
            New Chat Name
          </label>
          <input
            id="newChatName"
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            maxLength={120}
            ref={inputRef}
            className="mt-1 w-full p-2 bg-background border-altBackground rounded-md shadow-sm"
            autoComplete="off"
          />
          {newName.length > 30 && newName.length <= 120 && (
            <p className="text-accent text-sm mt-2">Name exceeds 30 characters. Consider shortening it.</p>
          )}
          {newName.length > 120 && (
            <p className="text-red-500 text-sm mt-2">Name exceeds 120 characters. Please shorten your chat name.</p>
          )}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="default" onClick={handleSave} aria-label="Save">
            Save
          </Button>
          <Button variant="secondary" onClick={onClose} aria-label="Cancel">
            Cancel
          </Button>
        </div>
      </div>
      {showPopup && <PopupMessage message="Chat name updated successfully!" />}
    </div>
  )
}

export const MenuItems: FC<Prop> = ({ menuItems }) => {
  const { id } = useParams()
  const router = useRouter()
  const { showError } = useGlobalMessageContext()
  const params = useParams()
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)

  const sendData = async (threadID: string): Promise<void> => {
    await SoftDeleteChatThreadByID(threadID)
    router.refresh()
    router.replace("/chat")
  }

  const handleOpenModal = (chatThreadId: string): void => {
    setSelectedThreadId(chatThreadId)
  }

  const handleCloseModal = (): void => {
    setSelectedThreadId(null)
  }

  const handleSaveModal = async (newName: string): Promise<void> => {
    if (newName.trim() !== "" && selectedThreadId) {
      try {
        await RenameChatThreadByID(selectedThreadId, newName)
        window.location.reload()
      } catch (e) {
        showError("" + e)
      } finally {
        handleCloseModal()
      }
    }
    router.refresh()
  }

  return (
    <>
      {menuItems.map(thread => (
        <MenuItem
          href={`/chat/${thread.id}`}
          isSelected={params.id === thread.id}
          key={thread.id}
          className="justify-between group hover:item relative"
        >
          {thread.chatType === "data" ? (
            <FileText size={16} className={id === thread.id ? " text-brand" : ""} />
          ) : thread.chatType === "audio" ? (
            <AudioLines size={16} className={id === thread.id ? " text-brand" : ""} />
          ) : (
            <MessageCircle size={16} className={id === thread.id ? " text-brand" : ""} />
          )}
          <span className="flex gap-2 items-center overflow-hidden flex-1">
            <span className="overflow-ellipsis truncate">{thread.name}</span>
          </span>
          {selectedThreadId !== thread.id && (
            <Button
              className="invisible group-hover:visible"
              size="sm"
              variant="default"
              aria-label={`Edit ${thread.name}`}
              onClick={() => handleOpenModal(thread.id)}
            >
              <Pencil size={16} />
            </Button>
          )}
          {selectedThreadId === thread.id && (
            <Modal isOpen={true} onClose={handleCloseModal} onSave={handleSaveModal} focusAfterClose={null} />
          )}
          <Button
            className="invisible group-hover:visible"
            size={"sm"}
            variant="default"
            aria-label="Delete Chat"
            onClick={async e => {
              e.preventDefault()
              const yesDelete = confirm("Are you sure you want to delete this chat?")
              if (yesDelete) {
                await sendData(thread.id)
              }
            }}
          >
            <Trash size={16} />
          </Button>
        </MenuItem>
      ))}
    </>
  )
}
