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

interface SliderProps {
  name: string;
  index: number;
  id: string;
}

export const CitationSlider: FC<SliderProps> = (props) => {
  const [node, formAction] = useFormState(CitationAction, null);

  const handleButtonClick = () => {
    const formData = new FormData();
    formData.append('index', props.index.toString());
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
            value={props.index}
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
