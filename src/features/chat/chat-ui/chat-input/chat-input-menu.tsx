import React, { FormEvent } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Button } from "@/components/ui/button";
import { Menu, Bird, File, Clipboard } from "lucide-react";
import { Message } from 'ai';
import { toast } from '@/components/ui/use-toast';

interface ChatInputMenuProps {
  onDocExport: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  setInput: (input: string) => void;
  messageCopy: Message[];
}

const ChatInputMenu: React.FC<ChatInputMenuProps> = ({ onDocExport, handleSubmit, setInput, messageCopy }) => {
  const fairClickHandler = () => {
    const fairaInput = "Help me complete a Queensland Government Fast AI Risk Assessment (FAIRA)";
    setInput(fairaInput);
      setTimeout(() => {
      const syntheticEvent = { preventDefault: () => {} } as FormEvent<HTMLFormElement>;
        handleSubmit(syntheticEvent);
    }, 0);
  };

  const copyToClipboard = () => {
    const formattedMessages = messageCopy.map(message => {
      const author = message.role === 'system' || message.role === 'assistant' ? "AI" : "You"; // Replace "AI" with aiName if available
      return `${author}: ${message.content}`; // Format as "Author: Message Content"
    }).join('\n');
  
    navigator.clipboard.writeText(formattedMessages)
      .then(() => {
        // Display a toast notification
        toast({
          title: "Success",
          description: "Messages copied to clipboard",
          // You can customize other properties as needed
        });
      })
      .catch(err => {
        // Display a toast notification for the error
        toast({
          title: "Error",
          description: "Failed to copy messages to clipboard",
          // You can customize other properties as needed
        });
      });
  };
  
  
  const showToast = (message: string) => {
  };
   

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="/** Similar styles as submit button here **/"
        >
          <Menu />
        </Button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-popover text-popover-foreground p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade rounded-md"
          sideOffset={5}
          style={{ padding: '10px' }}
        >
          <DropdownMenu.Item
              onSelect={fairClickHandler}
              className="DropdownMenuItem bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md"
          >
            <div style={{display: 'flex', alignItems: 'center', padding: '5px'}}>
              <Bird size={20} className="mr-2"/>
              Complete a Fast AI Risk Assessment
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-[1px] bg-secondary m-[5px]" />
          <DropdownMenu.Item
            onSelect={onDocExport}
            className="DropdownMenuItem bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md"
          >
            <div style={{display: 'flex', alignItems: 'center', padding: '5px'}}>
              <File size={20} className="mr-2"/>
              Export your Chat to File
            </div>
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-[1px] bg-secondary m-[5px]" />
          <DropdownMenu.Item
            onSelect={copyToClipboard}
            className="DropdownMenuItem bg-background text-foreground hover:bg-secondary hover:text-secondary-foreground rounded-md"
          >
            <div style={{display: 'flex', alignItems: 'center', padding: '5px'}}>
              <Clipboard size={20} className="mr-2"/>
              Copy Chat to Clipboard
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ChatInputMenu;