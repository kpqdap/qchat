import React, { useState, useEffect } from 'react';
import { PromptButtons } from '../../chat-services/prompt-buttons';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Prop {
  onPromptSelected: (prompt: string) => void;
  selectedPrompt: string | undefined;
}

export const PromptButton: React.FC<Prop> = ({ onPromptSelected, selectedPrompt }) => {
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await PromptButtons();
        setPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts from backend:', error);
      }
    };

    fetchPrompts();
  }, []);

  const handlePromptClick = (prompt: string) => {
    onPromptSelected(prompt);
  };

  return (
    <div className="space-container">
      <Tabs defaultValue={selectedPrompt} onValueChange={handlePromptClick}>
        {prompts.map((prompt, index) => (
          <TabsList key={index} className="w-full mb-2">
            <TabsTrigger
              value={prompt}
              className={`w-full text-center ${selectedPrompt === prompt ? 'bg-blue-500' : ''}`}
            >
              {prompt}
            </TabsTrigger>
          </TabsList>
        ))}
      </Tabs>
      <div className="additional-spacing" />
    </div>
  );
};
