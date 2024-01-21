"use client";

import { useGlobalMessageContext } from "@/features/global-message/global-message-context";
import { Message } from "ai";
import { UseChatHelpers, useChat } from "ai/react";
import React, { FC, createContext, useContext, useState, ReactNode } from "react";
import {
  ChatMessageModel,
  ChatThreadModel,
  ChatType,
  ConversationStyle,
  ConversationSensitivity,
  PromptGPTBody,
} from "../chat-services/models";
import { transformCosmosToAIModel } from "../chat-services/utils";
import { FileState, useFileState } from "./chat-file/use-file-state";
import {
  SpeechToTextProps,
  useSpeechToText,
} from "./chat-speech/use-speech-to-text";
import {
  TextToSpeechProps,
  useTextToSpeech,
} from "./chat-speech/use-text-to-speech";

type MessageRole = "function" | "user" | "assistant" | "system" | "tool";

interface MessageWithRole extends Message {
  role: MessageRole;
}

interface ChatContextProps extends UseChatHelpers {
  id: string;
  setChatBody: (body: PromptGPTBody) => void;
  chatBody: PromptGPTBody;
  fileState: FileState;
  onChatTypeChange: (value: ChatType) => void;
  onConversationStyleChange: (value: ConversationStyle) => void;
  onConversationSensitivityChange: (value: ConversationSensitivity) => void;
  speech: TextToSpeechProps & SpeechToTextProps;
  isModalOpen?: boolean;
  openModal?: () => void;
  closeModal?: () => void;
}

const ChatContext = createContext<ChatContextProps | null>(null);

interface Prop {
  children: React.ReactNode;
  id: string;
  chats: Array<ChatMessageModel>;
  chatThread: ChatThreadModel;
}

export const ChatProvider: FC<Prop> = (props) => {
  const { showError } = useGlobalMessageContext();

  const speechSynthesizer = useTextToSpeech();
  const speechRecognizer = useSpeechToText({
    onSpeech(value) {
      response.setInput(value);
    },
  });

  const fileState = useFileState();

  const [chatBody, setBody] = useState<PromptGPTBody>({
    id: props.chatThread.id,
    chatType: props.chatThread.chatType,
    conversationStyle: props.chatThread.conversationStyle,
    conversationSensitivity: props.chatThread.conversationSensitivity,
    chatOverFileName: props.chatThread.chatOverFileName,
  });

  const { textToSpeech } = speechSynthesizer;
  const { isMicrophoneUsed, resetMicrophoneUsed } = speechRecognizer;

  const response = useChat({
    onError,
    id: props.id,
    body: chatBody,

    initialMessages: transformCosmosToAIModel(props.chats),
    onFinish: async (lastMessage: Message) => {
      if (isMicrophoneUsed) {
        await textToSpeech(lastMessage.content);
        resetMicrophoneUsed();
      }
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const setChatBody = (body: PromptGPTBody) => {
    setBody(body);
  };

  const onChatTypeChange = (value: ChatType) => {
    fileState.setShowFileUpload(value);
    fileState.setIsFileNull(true);
    setChatBody({ ...chatBody, chatType: value });
  };

  const onConversationStyleChange = (value: ConversationStyle) => {
    setChatBody({ ...chatBody, conversationStyle: value });
  };

  const onConversationSensitivityChange = (value: ConversationSensitivity) => {
    setChatBody({ ...chatBody, conversationSensitivity: value });
  };

  function onError(error: Error) {
    showError(error.message, response.reload);
  }

  return (
    <ChatContext.Provider
      value={{
        ...response,
        setChatBody,
        chatBody,
        onChatTypeChange,
        onConversationStyleChange,
        onConversationSensitivityChange,
        fileState,
        id: props.id,
        speech: {
          ...speechSynthesizer,
          ...speechRecognizer,
        },
        isModalOpen,
        openModal,
        closeModal,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("ChatContext is null");
  }

  return context;
};