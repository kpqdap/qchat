import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatContext } from "@/features/chat/chat-ui/chat-context";
import { useGlobalConfigContext } from "@/features/global-config/global-client-config-context";
import { Loader, Send, Bird, File } from "lucide-react";
import { FC, FormEvent, useRef, useMemo, useState } from "react";
import { AI_NAME } from "@/features/theme/customise";
import { ChatFileSlider } from "../chat-file/chat-file-slider";
import { Microphone } from "../chat-speech/microphone";
import { useChatInputDynamicHeight } from "./use-chat-input-dynamic-height";
import { convertMarkdownToWordDocument } from "@/features/common/file-export";
import { Card } from "@/components/ui/card";
import { PromptSuggestion } from "./prompt-suggestion-UI";

interface Props {}

const ChatInput: FC<Props> = (props) => {
  const { setInput, handleSubmit, isLoading, input, chatBody, isModalOpen, messages } = useChatContext();
  const { speechEnabled } = useGlobalConfigContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { rows, resetRows, onKeyDown, onKeyUp } = useChatInputDynamicHeight({ buttonRef });
  const [keysPressed, setKeysPressed] = useState(new Set());

  const isDataChat = useMemo(() => chatBody.chatType === "data", [chatBody.chatType]);
  const fileChatVisible = useMemo(() => chatBody.chatType === "data" && chatBody.chatOverFileName, [chatBody.chatType, chatBody.chatOverFileName]);

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Australia/Brisbane";
  const getFormattedDateTime = (): string => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: timeZone };
    const formattedDate = new Intl.DateTimeFormat('en-AU', options).format(date);
    return formattedDate.split(',').join('_').split(' ').join('_').split(':').join('_');
  };

  const exportChatMessages = () => {
    const fileName = `QChatExport_${getFormattedDateTime()}.docx`;
    convertMarkdownToWordDocument(messages, fileName, AI_NAME);
  };

  const handleFAIRAClick = () => {
    setInput("Help me complete a Queensland Government Fast AI Risk Assessment (FAIRA)");

    setTimeout(() => {
      handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
    }, 0);
  };

  
  const [showPromptSuggestion, setShowPromptSuggestion] = useState(false);
  const previousInputRef = useRef('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    resetRows();
    setInput("");
    setShowPromptSuggestion(false);
  };

  let newInputValue = '';
  
  const onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;

    if ((keysPressed.has("Control") || keysPressed.has("Meta")) && (keysPressed.has("v") || keysPressed.has("c"))) {
      setShowPromptSuggestion(false);
    } else if (inputValue.length > 20 && inputValue.length <= 200) {
      setShowPromptSuggestion(true);
    } else {
      setShowPromptSuggestion(false);
    }

    previousInputRef.current = input;
    setInput(inputValue);
  };

  const onSelectSuggestion = (selectedValue: string) => {
    setInput(`${previousInputRef.current} ${selectedValue}`);
    setShowPromptSuggestion(false);
  };

  if (isModalOpen) {
    return null;
  }

  return (
    <form onSubmit={submit} className="absolute bottom-0 w-full flex items-center">
      <div className="container mx-auto max-w-4xl relative py-2 flex gap-2 items-center">
        {fileChatVisible && <ChatFileSlider />}

        <div className="mb-4">
          <Card>
            {showPromptSuggestion && (
              <PromptSuggestion 
                newInputValue={previousInputRef.current}
                onSelect={onSelectSuggestion}
                onHide={() => setShowPromptSuggestion(false)}
              />
            )}
          </Card>
        </div>

        <Textarea
          rows={rows}
          value={input}
          placeholder="Send a message"
          className="min-h-fit bg-background shadow-sm resize-none py-4 pr-[80px]"
          onKeyUp={onKeyUp}
          onKeyDown={onKeyDown}
          onChange={onChange}
        />
        <div className="absolute right-0 bottom-0 px-8 flex items-end h-full mr-2 mb-4">
          {speechEnabled && <Microphone disabled={isLoading} />}
          {!isDataChat || (isDataChat && fileChatVisible) ? (
            <>
              <Button
                size="icon"
                type="submit"
                variant="ghost"
                ref={buttonRef}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="animate-spin" size={16} /> : <Send size={16} />}
              </Button>
              {!isLoading && (
                <div className="hidden sm:flex">
                  <Button
                    onClick={handleFAIRAClick}
                    size="icon"
                    variant="ghost"
                    disabled={isLoading}
                  >
                    <Bird size={16} />
                  </Button>
                  <Button
                    onClick={exportChatMessages}
                    size="icon"
                    variant="ghost"
                    disabled={isLoading}
                  >
                    <File size={16} />
                  </Button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
