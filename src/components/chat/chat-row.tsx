"use client"

import React, { FC, useEffect, useState } from "react"
import { useChatContext } from "@/features/chat/chat-ui/chat-context"
import { ChatRole, ChatSentiment, FeedbackType } from "@/features/chat/models"
import Typography from "../typography"
import Modal from "@/features/ui/modal"
import { Markdown } from "../markdown/markdown"
import AssistantButtons from "@/features/ui/assistant-buttons"
import { AI_NAME } from "@/features/theme/theme-config"
import { CreateUserFeedback } from "@/features/chat/chat-services/chat-message-service"
import { Message } from "ai/react/dist"

export interface ChatRowProps {
  chatMessageId: string
  name: string
  message: Message & { sentiment?: ChatSentiment; feedback?: FeedbackType; reason?: string }
  type: ChatRole
  chatThreadId: string
  contentSafetyWarning?: string
}

export const ChatRow: FC<ChatRowProps> = props => {
  const [isIconChecked, setIsIconChecked] = useState(false)
  const [thumbsUpClicked, setThumbsUpClicked] = useState(props.message.sentiment == ChatSentiment.Positive)
  const [thumbsDownClicked, setThumbsDownClicked] = useState(props.message.sentiment == ChatSentiment.Negative)

  const [feedbackType, setFeedbackType] = useState(props.message.feedback)
  const [feedbackReason, setFeedbackReason] = useState(props.message.reason)

  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false)
  const { openModal, closeModal } = useChatContext()

  const toggleButton = (buttonId: string): void => {
    switch (buttonId) {
      case "ThumbsUp":
        setThumbsUpClicked(prevState => !prevState)
        setThumbsDownClicked(false)
        setIsIconChecked(false)
        CreateUserFeedback(props.chatMessageId, FeedbackType.None, ChatSentiment.Positive, "", props.chatThreadId)
          .then(res => console.log(res))
          .catch(err => console.error(err))
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

    setFeedbackType(FeedbackType.None)
    setFeedbackReason("")
  }

  useEffect(() => {
    if (isFeedbackModalOpen) openModal?.()
    else closeModal?.()
  }, [isFeedbackModalOpen])

  const handleThumbsDownClick = (): void => {
    setFeedbackModalOpen(true)
  }

  function handleModalSubmit() {
    CreateUserFeedback(
      props.chatMessageId,
      feedbackType || FeedbackType.None,
      ChatSentiment.Negative,
      feedbackReason || "",
      props.chatThreadId
    )
      .then(res => console.log(res))
      .catch(err => console.error(err))

    if (!thumbsDownClicked) toggleButton("ThumbsDown")

    setFeedbackMessage("Negative feedback submitted.")
    setTimeout(() => setFeedbackMessage(""), 2000)

    setFeedbackModalOpen(false)
  }

  const handleModalClose = () => {
    setFeedbackModalOpen(false)
  }

  const safetyWarning = props.contentSafetyWarning ? (
    <div
      className="prose prose-slate bg-alert text-primary dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none break-words rounded-md text-center text-sm md:text-base"
      tabIndex={0}
      aria-label="Content Safety Warning"
    >
      {props.contentSafetyWarning}
    </div>
  ) : null

  return (
    <article className="container mx-auto flex flex-col py-1 pb-4">
      <section className="bg-background flex-col gap-4 overflow-hidden rounded-md p-4">
        <header className="flex w-full items-center justify-between">
          <Typography variant="h3" className="text-heading flex-1 capitalize" tabIndex={0}>
            {props.name}
          </Typography>
          {process.env.NODE_ENV === "development" && (
            <Typography variant="h3" className="text-heading flex-1 capitalize" tabIndex={0}>
              {props.chatMessageId}
            </Typography>
          )}
          <Modal
            chatThreadId={props.chatThreadId}
            chatMessageId={props.chatMessageId}
            feedbackType={feedbackType}
            onFeedbackTypeChange={setFeedbackType}
            feedbackReason={feedbackReason}
            onFeedbackReasonChange={setFeedbackReason}
            open={isFeedbackModalOpen}
            onClose={handleModalClose}
            onSubmit={handleModalSubmit}
          />
        </header>
        <div
          className="prose prose-slate text-text dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 max-w-none break-words text-sm md:text-base"
          tabIndex={0}
        >
          <Markdown content={props.message.content} />
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
