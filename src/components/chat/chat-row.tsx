"use client"

import React, { FC, useState } from "react"
import { useChatContext } from "@/features/chat/chat-ui/chat-context"
import { ChatRole, ChatSentiment } from "@/features/chat/chat-services/models"
import { CreateUserFeedbackChatId } from "@/features/chat/chat-services/chat-service"
import Typography from "../typography"
import Modal from "../../features/ui/modal"
import { Markdown } from "../markdown/markdown"
import AssistantButtons from "../../features/ui/assistant-buttons"
import { AI_NAME } from "@/features/theme/customise"

interface ChatRowProps {
  chatMessageId: string
  name: string
  message: string
  type: ChatRole
  chatThreadId: string
  contentSafetyWarning?: string
  sentiment?: ChatSentiment
  feedback?: string
  reason?: string
}

export const ChatRow: FC<ChatRowProps> = props => {
  const [isIconChecked, setIsIconChecked] = useState(false)
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false)
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const { isModalOpen, openModal, closeModal } = useChatContext()

  const toggleButton = (buttonId: string): void => {
    switch (buttonId) {
      case "ThumbsUp":
        setThumbsUpClicked(prevState => !prevState)
        setThumbsDownClicked(false)
        setIsIconChecked(false)
        CreateUserFeedbackChatId(props.chatMessageId, "", ChatSentiment.Positive, "", props.chatThreadId)
          .then(res => console.log(res))
          .catch(err => console.log(err))
        break
      case "ThumbsDown":
        setThumbsDownClicked(prevState => !prevState)
        setThumbsUpClicked(false)
        setIsIconChecked(false)
        break
      case "CopyButton":
        setIsIconChecked(prevState => !prevState)
        setThumbsUpClicked(false)
        setThumbsDownClicked(false)
        break
      default:
        break
    }
  }

  const handleCopyButton = (): void => {
    toggleButton("CopyButton")
    const messageWithAttribution = props.message + ("\nText generated by by " + AI_NAME)
    navigator.clipboard
      .writeText(messageWithAttribution)
      .then(() => {
        setFeedbackMessage("Message copied to clipboard.")
      })
      .catch(_err => {
        setFeedbackMessage("Something happened and the message has not been copied.")
      })
      .finally(() => setTimeout(() => setFeedbackMessage(""), 2000))
  }

  const handleThumbsUpClick = (): void => {
    toggleButton("ThumbsUp")
    setFeedbackMessage("Positive feedback submitted.")
    setTimeout(() => setFeedbackMessage(""), 2000)
  }

  const handleThumbsDownClick = (): void => {
    toggleButton("ThumbsDown")
    if (openModal) {
      openModal()
    }
  }

  async function handleModalSubmit(_feedback: string, sentiment: string, _reason: string): Promise<void> {
    if (sentiment === ChatSentiment.Negative) {
      setFeedbackMessage("Negative feedback submitted.")
      setTimeout(() => setFeedbackMessage(""), 2000)
    }
  }

  const handleModalClose = async (): Promise<void> => {
    if (closeModal) {
      closeModal()
    }
    return Promise.resolve()
  }

  const safetyWarning = props.contentSafetyWarning ? (
    <div
      className="md:text-md prose prose-slate max-w-none break-words rounded-md bg-alert text-center text-sm text-primary dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 md:text-base"
      tabIndex={0}
      aria-label="Content Safety Warning"
    >
      {props.contentSafetyWarning}
    </div>
  ) : null

  return (
    <article className="container mx-auto flex flex-col py-1 pb-4">
      <section className="flex-col gap-4 overflow-hidden rounded-md bg-background p-4">
        <header className="flex w-full items-center justify-between">
          <Typography variant="h3" className="flex-1 capitalize text-heading" tabIndex={0}>
            {props.name}
          </Typography>
          <Modal
            chatThreadId={props.chatThreadId}
            chatMessageId={props.chatMessageId}
            open={isModalOpen || false}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
          />
        </header>
        <div
          className="md:text-md prose prose-slate max-w-none break-words text-sm text-text dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 md:text-base"
          tabIndex={0}
        >
          <Markdown content={props.message} />
        </div>
        {safetyWarning}
        <div className="sr-only" aria-live="assertive">
          {feedbackMessage}
        </div>
        {props.type === "assistant" && (
          <AssistantButtons
            isIconChecked={isIconChecked}
            thumbsUpClicked={thumbsUpClicked}
            thumbsDownClicked={thumbsDownClicked}
            handleCopyButton={handleCopyButton}
            handleThumbsUpClick={handleThumbsUpClick}
            handleThumbsDownClick={handleThumbsDownClick}
          />
        )}
      </section>
    </article>
  )
}
export default ChatRow
