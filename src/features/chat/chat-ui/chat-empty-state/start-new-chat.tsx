import Typography from "@/components/typography";
import { Card } from "@/components/ui/card";
import { AI_NAME } from "@/features/theme/customise";
import { FC } from "react";
import { NewChat } from "../../chat-menu/new-chat";

interface Prop {}

export const StartNewChat: FC<Prop> = (props) => {
  return (
    <div className="grid grid-cols-3 w-full items-center container mx-auto max-w-3xl justify-center h-full gap-9">
      <Card className="col-span-3 flex flex-col gap-5 p-5">
        <Typography variant="h4" className="text-primary">
          {AI_NAME}<br />
          The Queensland Government AI Assistant
        </Typography>
        <div className="flex flex-col gap-2">
          <p className="">
            QChat, your text-based virtual assistant, is equipped with cutting-edge Generative AI technology to empower you in your role within the Queensland Government.</p>
            <p>Let QChat assist you in accomplishing remarkable outcomes.
          </p>
          {/* Conditionally render this text on screens larger than sm/md */}
          <p className="hidden lg:block">
          Press the plus button below to get started or select one of your existing chats from the left-hand panel.
          </p>
          <p className="lg:hidden">
          Press the plus button below to get started.
          </p>
        </div>
        <div className="-mx-5 -mb-5 p-5 flex flex-col border-t bg-muted">
          <NewChat />
        </div>
      </Card>
    </div>
  );
};
