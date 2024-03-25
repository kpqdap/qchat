import React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/features/ui/tabs"
import { XCircle, Ban, FileQuestion } from "lucide-react"
import { FeedbackType } from "../chat/models"

interface FeedbackButtonsProps {
  selectedType: FeedbackType
  onFeedbackTypeChange: (type: FeedbackType) => void
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ selectedType, onFeedbackTypeChange }) => {
  return (
    <div className="p-4">
      <Tabs
        defaultValue={FeedbackType.None}
        value={selectedType}
        onValueChange={type =>
          onFeedbackTypeChange(
            Object.values(FeedbackType).includes(type as any) ? (type as FeedbackType) : FeedbackType.None
          )
        }
      >
        <TabsList className="grid h-12 w-full grid-cols-3 items-stretch">
          <TabsTrigger
            value={FeedbackType.HarmfulUnsafe}
            className="flex grow items-center justify-center gap-2 px-3 py-2"
            aria-label="Mark feedback as unsafe"
          >
            <Ban size={20} aria-hidden="true" /> Unsafe
          </TabsTrigger>
          <TabsTrigger
            value={FeedbackType.Inaccurate}
            className="flex grow items-center justify-center gap-2 px-3 py-2"
            aria-label="Mark feedback as inaccurate"
          >
            <XCircle size={20} aria-hidden="true" /> Inaccurate
          </TabsTrigger>
          <TabsTrigger
            value={FeedbackType.Unhelpful}
            className="flex grow items-center justify-center gap-2 px-3 py-2"
            aria-label="Mark feedback as unhelpful"
          >
            <FileQuestion size={20} aria-hidden="true" /> Unhelpful
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

export default FeedbackButtons
