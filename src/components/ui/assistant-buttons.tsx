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
  let iconSize = 10; // Default size
  let buttonClass = "h-9"; // Default button class for 'SM' size

  if (width < 768) {
    // Apply custom class for smaller screens (simulate 'XS' size)
    buttonClass = "h-7"; // Example height, adjust as needed
  } else if (width >= 768 && width < 1024) {
    iconSize = 12; // Set icon size for md
  } else if (width >= 1024) {
    iconSize = 16; // Set icon size for lg and above
  }

  return (
    <div className="container flex items-left w-full">
      <Button
        variant={"ghost"}
        size={"sm"} // Keep using 'sm' as it's a valid size
        className={buttonClass} // Apply conditional class
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
        size={"sm"} // Keep using 'sm' as it's a valid size
        className={buttonClass} // Apply conditional class
        title="Thumbs up"
        onClick={handleThumbsUpClick}
      >
        {thumbsUpClicked ? (
          <CheckIcon size={iconSize} />
        ) : (
          <ThumbsUp size={iconSize} />
        )}
      </Button>

      <Button
        variant={"ghost"}
        size={"sm"} // Keep using 'sm' as it's a valid size
        className={buttonClass} // Apply conditional class
        title="Thumbs down"
        onClick={handleThumbsDownClick}
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
