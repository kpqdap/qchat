import { FC } from "react";
import Typography from "@/components/typography";
import { Card } from "@/components/ui/card";
import { trackEventClientSide } from "@/features/common/app-insights";
import { FC, FormEvent, useRef, useState } from "react";
import { useChatContext } from "../chat-context";
import { ChatFileUI } from "../chat-file/chat-file-ui";
import { ChatStyleSelector } from "./chat-style-selector";
import { ChatSensitivitySelector } from "./chat-sensitivity-selector";
import { ChatTypeSelector } from "./chat-type-selector";
import { PromptButton } from "./prompt-buttons-UI";
import { Card } from "@/components/ui/card";

interface Prop {}

export const ChatMessageEmptyState: FC<Prop> = (props) => {
  
  const { setInput, handleSubmit, isLoading, input, chatBody } = useChatContext();
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);

  const handlePromptSelected = (prompt: string) => {
    setSelectedPrompt(prompt);
    setInput(prompt);

    try {
      setInput(prompt);
      trackEventClientSide('Prompt_Button_Click', { input: "Prompt button suggestion" });
      setTimeout(() => {
        handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
      }, 0);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const { fileState } = useChatContext();
  const { showFileUpload } = fileState;

  return (
    <div className="grid grid-cols-5 w-full items-center container overflow-auto mx-auto max-w-3xl justify-center h-full p-4 gap-9 pb-[80px]">
      <Card className="col-span-5 flex flex-col gap-5 p-5 ">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Set the Sensitivity of your chat
          </p>
          <ChatSensitivitySelector disable={false} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Choose a conversation style
          </p>
          <ChatStyleSelector disable={false} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            How would you like to chat?
          </p>
          <ChatTypeSelector disable={false} />
        </div>
        {showFileUpload === "data" && <ChatFileUI />}
        <div className="flex flex-col gap-2">
          <PromptButton onPromptSelected={handlePromptSelected} selectedPrompt={selectedPrompt} disable={false} />
        </div>
      </Card>
    </div>
  );
};