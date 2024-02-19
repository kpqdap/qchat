import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioLines, FileText, MessageCircle } from "lucide-react";
import { FC } from "react";
import { ChatType } from "../../chat-services/models";
import { useChatContext } from "../chat-context";
import { getTenantId } from "@/features/auth/helpers";

interface Prop {
  disable: boolean;
}

export const ChatTypeSelector: FC<Prop> = (props) => {
  const { chatBody, onChatTypeChange } = useChatContext();
  return (
    <Tabs
      defaultValue={chatBody.chatType}
      onValueChange={(value) => {
        onChatTypeChange(value as ChatType);
      }}
    >
      <TabsList aria-label="Conversation Type" className="grid w-full grid-cols-3 h-12 items-stretch">
        <TabsTrigger
          value="simple"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.chatType === "simple"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <MessageCircle size={20} aria-hidden="true"/> General
        </TabsTrigger>
        <TabsTrigger
          value="data"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.chatType === "data"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <FileText size={20} aria-hidden="true"/> File
        </TabsTrigger>
        <TabsTrigger
          value="audio"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.chatType === "audio"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <AudioLines size={20} aria-hidden="true"/> Transcribe
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
