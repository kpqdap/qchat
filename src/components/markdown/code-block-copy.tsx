import React, { FC, useState } from 'react';
import { Button } from "../ui/button";
import { ClipboardIcon, CheckIcon } from 'lucide-react';

interface CopyButtonProps {
  copyText: string;
}

export const CopyButton: FC<CopyButtonProps> = ({ copyText }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
      <Button
        variant="ghost"
        size="sm"
        className="copy-button"
        title={isCopied ? "Copied!" : "Copy"}
        onClick={handleCopy}
      >
        {isCopied ? <CheckIcon size={16} /> : <ClipboardIcon size={16} />}
      </Button>
  );
};

