'use server'
import "server-only";
import { OpenAIInstance } from "@/features/common/openai";
import { ChatThreadModel } from "./models";
import { UpsertChatThread } from "./chat-thread-service";

async function generateChatName(chatMessage: string): Promise<string> {
    const openAI = OpenAIInstance();

    try {
        const name = await openAI.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `- create a succinct title, limited to five words and 20 characters, for the following chat """ ${chatMessage}""" conversation with a generative AI assistant:
            - this title should effectively summarise the main topic or theme of the chat.
            - it will be used in the app's navigation interface, so it should be easily understandable and reflective of the chat's content 
            to help users quickly grasp what the conversation was about.`
                },
            ],
            model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        });

        if (name.choices && name.choices[0] && name.choices[0].message && name.choices[0].message.content) {
            return name.choices[0].message.content.replace(/^"+|"+$/g, ''); // Remove proceeding and trailing quotes from the returned message
        } else {
            console.error('Error: Unexpected response structure from OpenAI API.');
            return "";
        }

    } catch (e) {
        console.error(`An error occurred: ${e}`);
        const words: string[] = chatMessage.split(' ');
        const name: string = 'New Chat by Error';
        return name;
    }
}

async function generateChatCategory(chatMessage: string): Promise<string> {
    const openAI = OpenAIInstance();

    let categories = [
        'Information Processing and Management',
        'Communication and Interaction',
        'Decision Support and Advisory',
        'Educational and Training Services',
        'Operational Efficiency and Automation',
        'Public Engagement and Services',
        'Innovation and Development',
        'Creative Assistance',
        'Lifestyle and Personal Productivity',
        'Entertainment and Engagement',
        'Emotional and Mental Support'
    ];

    try {
        const category = await openAI.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Categorise this chat session inside double quotes "" ${chatMessage} "" into one of the following 
            categories: ${categories.join(', ')} inside square brackets based on my query`
                },
            ],
            model: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        });


        if (category.choices[0].message.content != null) {
            return category.choices[0].message.content;
        }
        else {
            console.log(`Uncategorised chat.`);
            return "Uncategorised!";
        }

    } catch (e) {
        console.error(`An error occurred: ${e}`);
        const words: string[] = chatMessage.split(' ');
        const category: string = 'Uncategorised';
        return category;
    }
}

export async function StoreOriginalChatName(currentChatName: string) {
    let previousChatName: string = "";
    if (currentChatName !== previousChatName) {
        previousChatName = currentChatName; // store the original chat name
    }
    return previousChatName;
}

/**
 * Generates Chat Category and Chat Thread Title
 */
export async function chatCatName(chatThread: ChatThreadModel, content: string) {
    try {

        if (chatThread.chatCategory === "Uncategorised") {
            chatThread.chatCategory = await generateChatCategory(content);
            chatThread.name = await generateChatName(content);

            UpsertChatThread(chatThread);
        }

    } catch (e) {
        console.log("Do some magic failed", e);
    }
}