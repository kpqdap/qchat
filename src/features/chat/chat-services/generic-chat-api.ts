import "server-only";
import { OpenAIInstance } from "@/features/common/openai";
 
export interface Message {
    role: 'function' | 'system' | 'user' | 'assistant';
    content: string;
}
 
interface GenericChatAPIProps {
  messages: Message[];
}
 
export const GenericChatAPI = async (props: GenericChatAPIProps): Promise<string> => {
    const openAI = OpenAIInstance();
  
    try {
      const messageResponse = await openAI.chat.completions.create({
        messages: props.messages,
        model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      });
  
      const prompt = messageResponse.choices[0]?.message?.content;
  
      if (prompt === null) {
        console.error('Error: Unexpected message structure from OpenAI API.');
        throw new Error('Unexpected message structure from OpenAI API.');
      }
      
      return prompt as string;
  
    } catch (e) {
      console.error(`An error occurred: ${e}`);
      throw e;
    }
};
 
