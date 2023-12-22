"use client";
import { ChatRole } from "@/features/chat/chat-services/models";
import { isNotNullOrEmpty } from "@/features/chat/chat-services/utils";
import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardIcon, UserCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { FC, useState} from "react";
import { Markdown } from "../markdown/markdown";
import Typography from "../typography";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import Modal from "../ui/modal";
import {CreateUserFeedbackChatId} from "@/features/chat/chat-services/chat-service";



interface ChatRowProps {
  chatMessageId: string;
  name: string;
  profilePicture: string;
  message: string;
  type: ChatRole;
}

 export const ChatRow: FC<ChatRowProps> = (props) => {
  const [isIconChecked, setIsIconChecked] = useState(false);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
  const [thumbsDownClicked, setThumbsDownClicked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [reason, setReason] = useState('');

  
  const toggleButton = (buttonId: string) => {
    switch (buttonId) {
        case 'thumbsUp':
            setThumbsUpClicked(prevState => !prevState);
            setThumbsDownClicked(false);
            setIsIconChecked(false);
            break;
        case 'thumbsDown':
            setThumbsDownClicked(prevState => !prevState);
            setThumbsUpClicked(false);
            setIsIconChecked(false);
            break;
        case 'CopyButton':
          setIsIconChecked(prevState => !prevState);
          setThumbsUpClicked(false);
          setThumbsDownClicked(false);
            break;
        default:
            break;
    }
};

  const handleCopyButton = () => {
    toggleButton('CopyButton');
    navigator.clipboard.writeText(props.message);
  };

  async function handleModalSubmit(feedback: string, reason: string): Promise<void> {
    setFeedback(feedback);
    setReason(reason);
    setIsModalOpen(false);
    CreateUserFeedbackChatId(props.chatMessageId, feedback, reason);

  };


  const openModal = () => {
    toggleButton('thumbsDown');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const buttonStyleThumbsUp = {
    backgroundColor: thumbsUpClicked ? 'lightblue' : 'transparent',
  } as React.CSSProperties;

  const buttonStyleThumbsDown = {
    backgroundColor: thumbsDownClicked ? 'lightblue' : 'transparent',
  } as React.CSSProperties;


  const handleThumbsUpClick = () => {
    toggleButton('thumbsUp');

  };

  return (
    <div
      className={cn(
        "container mx-auto max-w-4xl py-6 flex flex-col ",
        props.type === "assistant" ? "items-start" : "items-end"
      )}
    >
      <div
        className={cn(
          "flex flex-col  max-w-[690px] border rounded-lg overflow-hidden  p-4 gap-8"
        )}
      >
        <div className="flex flex-1">
          <div className="flex gap-4 items-center flex-1">
            <div className="">
              {isNotNullOrEmpty(props.profilePicture) ? (
                <Avatar>
                  <AvatarImage src={props.profilePicture} />
                </Avatar>
              ) : (
                <UserCircle
                  width={40}
                  height={40}
                  strokeWidth={1.2}
                  className="text-primary"
                />
              )}
            </div>
            <Typography variant="h5" className="capitalize text-sm">
              {props.name}
            </Typography>
          </div>
          <Button
            variant={"ghost"}
            size={"sm"}
            title="Thumbs up"
            className="justify-right flex"
            onClick={handleThumbsUpClick}
            style={buttonStyleThumbsUp}         
          >
       <ThumbsUp size={16} />
          </Button>

          <Button
            variant={"ghost"}
            size={"sm"}
            title="Thumbs down"
            className="justify-right flex"
            onClick={openModal}
          >
           <ThumbsDown size={16} />
          </Button>
          <Modal  chatThreadId={props.chatMessageId}
                  open={isModalOpen}
                  onClose={closeModal}
                  onSubmit={(chatMessageId,feedback, reason) => {
                  handleModalSubmit(feedback, reason);
                  }}                 
          />
          <Button
            variant={"ghost"}
            size={"sm"}
            title="Copy text"
            className="justify-right flex"
            onClick={handleCopyButton}
          >
            {isIconChecked ? (
              <CheckIcon size={16} />
            ) : (
              <ClipboardIcon size={16} />
            )}
          </Button>
        </div>
        <div
          className={cn(
            "-m-4 p-4 prose prose-slate dark:prose-invert break-words prose-p:leading-relaxed prose-pre:p-0 max-w-non",
            props.type === "assistant"
              ? "bg-secondary"
              : "bg-primary text-white"
          )}
        >
          <Markdown content={props.message} />
        </div>
      </div>
    </div>
  );
};

export default ChatRow;
