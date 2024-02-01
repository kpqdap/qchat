"use server";
import "server-only";
import { OpenAIInstance } from "@/features/common/openai";


const openAI = OpenAIInstance();

export const getPromptSuggestions = async (input: string): Promise<string[]> => {
    try {
      const promptSuggestion = await openAI.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `- create a succinct prompt suggestion, to complete the chat inside double quotes ""  ${input} "" without repeating the chat.
                - this prompt will complete the user input with the most relevant words.`,
          },
        ],
        model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      });
  
      if (!promptSuggestion || promptSuggestion.choices.length === 0) {
        console.error('Error: Unexpected prompt suggestion structure from OpenAI API.');
        return [];
      }
  
      const prompt = promptSuggestion.choices[0].message?.content;
  
      if (prompt == null) {
        console.error('Error: Prompt is null or undefined.');
        return [];
      }
  
      const cleanedPrompt = prompt.replace(/^"+|"+$/g, '');
  
      if (cleanedPrompt.trim() === '') {
        console.error('Error: Cleaned prompt is empty.');
        return [];
      }
  
      return [cleanedPrompt];
    } catch (e) {
      console.error(`An error occurred: ${e}`);
      return [''];
    }
  };