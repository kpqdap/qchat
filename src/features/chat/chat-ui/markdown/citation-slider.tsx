import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FC } from "react";
import { useFormState } from "react-dom";
import { CitationAction } from "./citation-action";
import { useChatContext } from "../chat-context";

interface SliderProps {
  name: string;
  index: number;
  id: string;
  tenantId: string;
  userId: string;
  order: number;
  chatThreadId: string;
}

export const CitationSlider: FC<SliderProps> = (props) => {
  const chatContext = useChatContext();
  const { userId, tenantId } = chatContext.chatBody;
  const chatThreadId = chatContext.id;
  const [node, formAction] = useFormState(CitationAction, null);

  const handleButtonClick = () => {
    const formData = new FormData();
    formData.append('index', props.index.toString());
    formData.append('id', props.id);
    formData.append('userId', userId);
    formData.append('tenantId', tenantId);
    formData.append('chatThreadId', chatThreadId);
    formData.append('order', props.order.toString());
    formAction(formData);
  }

  return (
    <form>
      <input type="hidden" name="id" value={props.id} />
      <Sheet>
        <SheetTrigger asChild>
          <Button
            aria-label={`Citation number ${props.index}`}
            variant="outline"
            size="sm"
            onClick={handleButtonClick}
            type="button"
            value={props.order}
          >
            {props.index}
          </Button>
        </SheetTrigger>
        <SheetContent aria-modal="true" role="dialog" aria-labelledby="citationSheetTitle">
          <SheetHeader>
            <SheetTitle id="citationSheetTitle">Citation</SheetTitle>
          </SheetHeader>
          <div className="text-sm text-muted-foreground">{node}</div>
        </SheetContent>
      </Sheet>
    </form>
  );
};
