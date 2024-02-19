"use client";

import React from "react";
import { Button } from "../ui/button";
import { CheckIcon, ClipboardIcon, ThumbsUp, ThumbsDown } from "lucide-react";
import { useWindowSize } from "./windowsize"; // Import useWindowSize

interface AssistantButtonsProps {
  isIconChecked: boolean;
  thumbsUpClicked: boolean;
  thumbsDownClicked: boolean;
  handleCopyButton: () => void;
  handleThumbsUpClick: () => void;
  handleThumbsDownClick: () => void;
}

export const AssistantButtons: React.FC<AssistantButtonsProps> = ({
  isIconChecked,
  thumbsUpClicked,
  thumbsDownClicked,
  handleCopyButton,
  handleThumbsUpClick,
  handleThumbsDownClick
}) => {
  const { width } = useWindowSize();
  let iconSize = 10;
  let buttonClass = "h-9";

  if (width < 768) {
    buttonClass = "h-7";
  } else if (width >= 768 && width < 1024) {
    iconSize = 12;
  } else if (width >= 1024) {
    iconSize = 16;
  }

  return (
    <div className="container flex items-left w-full">
      <Button
        aria-label="Copy text"
        variant={"ghost"}
        size={"sm"}
        className={buttonClass}
        title="Copy text"
        onClick={handleCopyButton}
      >
        {isIconChecked ? (
          <CheckIcon size={iconSize} />
        ) : (
          <ClipboardIcon size={iconSize} />
        )}
      </Button>

      <Button
        variant={"ghost"}
        size={"sm"}
        className={buttonClass}
        title="Thumbs up"
        onClick={handleThumbsUpClick}
        aria-label="Provide positive feedback"
      >
        {thumbsUpClicked ? (
          <CheckIcon size={iconSize} />
        ) : (
          <ThumbsUp size={iconSize} />
        )}
      </Button>

      <Button
        variant={"ghost"}
        size={"sm"}
        className={buttonClass}
        title="Thumbs down"
        onClick={handleThumbsDownClick}
        aria-label="Provide negative feedback"
      >
        {thumbsDownClicked ? (
          <CheckIcon size={iconSize} />
        ) : (
          <ThumbsDown size={iconSize} />
        )}
      </Button>
    </div>
  );
};

export default AssistantButtons;
