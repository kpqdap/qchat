import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brush, CircleDot, Scale } from "lucide-react";
import { FC } from "react";
import { ConversationStyle } from "../../chat-services/models";
import { useChatContext } from "../chat-context";

interface Prop {
  disable: boolean;
}

export const ChatStyleSelector: FC<Prop> = (props) => {
  const { onConversationStyleChange, chatBody } = useChatContext();

  return (
    <Tabs
      defaultValue={chatBody.conversationStyle}
      onValueChange={(value) =>
        onConversationStyleChange(value as ConversationStyle)
      }
    >
      <TabsList aria-label="Conversation Style" className="grid w-full grid-cols-3 h-12 items-stretch">
        <TabsTrigger
          value="precise"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.conversationStyle === "precise"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <CircleDot size={20} aria-hidden="true"/> Precise
        </TabsTrigger>
        <TabsTrigger
          value="balanced"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.conversationStyle === "balanced"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <Scale size={20} aria-hidden="true"/> Balanced
        </TabsTrigger>
        <TabsTrigger
          value="creative"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.conversationStyle === "creative"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <Brush size={20} aria-hidden="true"/> Creative
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
