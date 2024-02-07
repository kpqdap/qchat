"use server";
import "server-only";
import { GenericChatAPI } from "./generic-chat-api"; 

export const PromptButtons = async (): Promise<string[]> => {
  
    try {
        const promptButtons = await GenericChatAPI({
          messages: [
            {
              role: "system",
              content: ` - create 2 different succinct prompt button suggestion, limited to ten words, for queensland government employees:
              - this prompt will have some suggestions similar to the below examples:
                " Write a Ministerial Briefing Note "
                " Write a response to a ... "
                " Rewrite this in layman terms "
                " Provide a summary of the below text " 
              - provide response as an array only, must be in format: ["Prompt1", "Prompt2"]`
            },
          ],
        });
  
        const prompt = promptButtons;
        const prompts = JSON.parse(prompt as string) as string[];
  
      if (prompts.some(prompt => prompt === null)) {
        console.error('Error: Unexpected prompt button structure from OpenAI API.');
        return [];
      }
  
        const filteredPrompts = prompts.filter(prompt => prompt !== null);
  
        if (filteredPrompts.length === 0) {
          console.error('Error: All prompts are null. Unexpected prompt button structure from OpenAI API.');
          return [];
        }
        
        return filteredPrompts as string[];
  
  
    } catch (e) {
      console.error(`An error occurred: ${e}`);
      return ['Write a Ministerial Briefing Note', 'Provide a summary of the below text'];
    }
  };