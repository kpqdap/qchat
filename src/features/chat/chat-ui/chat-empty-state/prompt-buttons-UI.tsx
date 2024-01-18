import React, { useState, useEffect  } from 'react';
import { PromptButtons } from '../../chat-services/prompt-buttons';


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
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          onClick={() => handlePromptClick(prompt)}
          className={`bg-gray-300 rounded cursor-pointer ${selectedPrompt === prompt ? 'bg-blue-500' : ''}`} >
          {prompt}
        </button>
      ))}
    </div>
  );
};