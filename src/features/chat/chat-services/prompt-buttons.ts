"use server";
import "server-only";
import { GenericChatAPI } from "./generic-chat-api";  
import { translator } from "./chat-translator";

export const PromptButtons = async (): Promise<string[]> => {
  const apiName = "generatePromptButtons";
  if (process.env.PROMPT_BUTTON_ENABLED) {
    try {
        const promptButtons = await GenericChatAPI(apiName, {
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
 
        const translatedPromptButtons = await translator(promptButtons);
        const prompt = translatedPromptButtons;
        const prompts = JSON.parse(prompt as unknown as string) as string[];
  
  
      if (prompts.some(prompt => prompt === null)) {
        console.log('Error: Unexpected prompt button structure from OpenAI API.');
        return [];
      }
  
        const filteredPrompts = prompts.filter(prompt => prompt !== null);
  
        if (filteredPrompts.length === 0) {
          console.log('Error: All prompts are null. Unexpected prompt button structure from OpenAI API.');
          return [];
        }
        
        return filteredPrompts as string[];
  
  
    } catch (e) {
      console.log(`An error occurred: ${e}`);
      return ['Write a Ministerial Briefing Note', 'Provide a summary of the below text'];
    }
  } else {
    return ['Write a Ministerial Briefing Note', 'Provide a summary of the below text'];
  }
  };