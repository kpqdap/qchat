import React, { useState, useEffect } from 'react';
import { PromptSuggestion } from '../../chat-services/chat-thread-service';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Prop {
  onPromptSelected: (prompt: string) => void;
  disable?: boolean;
}

export const PromptButton: React.FC<Prop> = ({ onPromptSelected, disable }) => {
  const [prompts, setPrompts] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await PromptSuggestion();
        setPrompts(data);
      } catch (error) {
        console.error('Error fetching prompts from backend:', error);
      }
    };

    fetchPrompts();
  }, []);

  const handlePromptSelection = (prompt: string) => {
    setSelectedPrompt(prompt);
    onPromptSelected(prompt);
  };

  return (
    <div className="space-container">
      <Tabs defaultValue={selectedPrompt} onValueChange={handlePromptSelection}>
        {prompts.map((prompt, index) => (
          <TabsList key={index} className="w-full mb-2">
            <TabsTrigger
              value={prompt}
              className={`w-full text-center ${selectedPrompt === prompt ? 'bg-blue-500' : ''}`}
              disabled={disable}
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
