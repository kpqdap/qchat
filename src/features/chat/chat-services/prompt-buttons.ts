// "use server";
// import "server-only";
// import { GenericChatAPI } from "./generic-chat-api";

// export const PromptButtons = async (): Promise<string[]> => {
//   const apiName = "generatePromptButtons";
//   const defaultPrompts = ['Write a Ministerial Briefing Note', 'Provide a summary of the below text'];

//   // Early return if feature is not enabled
//   if (!process.env.PROMPT_BUTTON_ENABLED) {
//     return defaultPrompts;
//   }

//   try {
//     const response = await GenericChatAPI(apiName, {
//       messages: [{
//         role: "system",
//         content: ` - create 2 different succinct prompt button suggestion, limited to ten words, for queensland government employees:
//         - this prompt will have some suggestions similar to the below examples:
//           " Write a Ministerial Briefing Note "
//           " Write a response to a ... "
//           " Rewrite this in layman terms "
//           " Provide a summary of the below text " 
//         - provide response as an array only, must be in format: ["Prompt1", "Prompt2"]`
//       }],
//     });

//     const prompts = JSON.parse(response) as string[];

//     // Validate prompts structure
//     if (!Array.isArray(prompts) || prompts.some(prompt => typeof prompt !== 'string')) {
//       console.error('Error: Unexpected prompt button structure from OpenAI API.');
//       return defaultPrompts;
//     }

//     // Filter out any non-string values (additional safeguard)
//     const filteredPrompts = prompts.filter(prompt => typeof prompt === 'string');

//     // Return default prompts if API response is empty or invalid
//     return filteredPrompts.length > 0 ? filteredPrompts : defaultPrompts;
//   } catch (error) {
//     console.error(`An error occurred: ${error}`);
//     return defaultPrompts;
//   }
// };

"use server";
import "server-only";
import { GenericChatAPI } from "./generic-chat-api";

/**
 * Converts a string environment variable to a boolean.
 * @param variable The name of the environment variable.
 * @returns {boolean} The boolean value of the environment variable.
 */
function getBooleanEnv(variable: string): boolean {
  return process.env[variable]?.toLowerCase() === 'true';
}

/**
 * Fetches prompt buttons based on environment configuration.
 * @returns {Promise<string[]>} An array of prompt buttons.
 */
export const PromptButtons = async (): Promise<string[]> => {
  const apiName = "generatePromptButtons";
  const defaultPrompts = ['Write a Ministerial Briefing Note', 'Provide a summary of the below text'];

  // Check if prompt buttons feature is enabled via environment variable
  if (!getBooleanEnv('PROMPT_BUTTON_ENABLED')) {
    return defaultPrompts;
  }

  try {
    const response = await GenericChatAPI(apiName, {
      messages: [{
        role: "system",
        content: ` - create 2 different succinct prompt button suggestion, limited to ten words, for queensland government employees:
        - this prompt will have some suggestions similar to the below examples:
          " Write a Ministerial Briefing Note "
          " Write a response to a ... "
          " Rewrite this in layman terms "
          " Provide a summary of the below text " 
        - provide response as an array only, must be in format: ["Prompt1", "Prompt2"]`
      }],
    });

    const prompts = JSON.parse(response) as string[];

    // Validate prompts to ensure they are all strings
    if (!Array.isArray(prompts) || prompts.some(prompt => typeof prompt !== 'string')) {
      console.error('Error: Unexpected prompt button structure from OpenAI API.');
      return defaultPrompts;
    }

    // Filter out any non-string values (additional safeguard)
    const filteredPrompts = prompts.filter(prompt => typeof prompt === 'string');

    // Return filtered prompts or default prompts if API response is empty or invalid
    return filteredPrompts.length > 0 ? filteredPrompts : defaultPrompts;
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return defaultPrompts;
  }
};
