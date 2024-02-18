import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ShieldAlert, ShieldX } from "lucide-react";
import { FC } from "react";
import { ConversationSensitivity } from "../../chat-services/models";
import { useChatContext } from "../chat-context";

interface Prop {
  disable: boolean;
}

export const ChatSensitivitySelector: FC<Prop> = (props) => {
  const { onConversationSensitivityChange, chatBody } = useChatContext();

  return (
    <Tabs
      defaultValue={chatBody.conversationSensitivity}
      onValueChange={(value) =>
        onConversationSensitivityChange(value as ConversationSensitivity)
      }
    >
      <TabsList aria-label="Conversation Sensitivity" className="grid w-full grid-cols-3 h-12 items-stretch">
        <TabsTrigger
          value="official"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.conversationSensitivity === "official"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <Shield size={20} aria-hidden="true"/> Official
        </TabsTrigger>
        <TabsTrigger
          value="sensitive"
          className="flex gap-2"
          disabled={props.disable}
          role="tab"
          aria-selected={chatBody.conversationSensitivity === "sensitive"}
          aria-disabled={props.disable ? "true" : undefined}
        >
          <ShieldAlert size={20} aria-hidden="true"/> Sensitive
        </TabsTrigger>
        <TabsTrigger
          value="protected"
          className="flex gap-2"
          disabled={true}
          role="tab"
          aria-selected={chatBody.conversationSensitivity === "protected"}
          aria-disabled="true"
        >
          <ShieldX size={20} aria-hidden="true"/> Protected
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
