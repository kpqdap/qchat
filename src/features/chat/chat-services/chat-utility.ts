"use server"
import "server-only"
import { ChatThreadModel } from "../models"
import { UpsertChatThread } from "./chat-thread-service"
import { GenericChatAPI } from "./generic-chat-api"

async function generateChatName(chatMessage: string): Promise<string> {
  const apiName = "generateChatName"
  try {
    const name = await GenericChatAPI(apiName, {
      messages: [
        {
          role: "system",
          content: `- create a succinct title, limited to five words and 20 characters, for the following chat """${chatMessage}""" conversation with a generative AI assistant:
                - this title should effectively summarise the main topic or theme of the chat.
                - it will be used in the app's navigation interface, so it should be easily understandable and reflective of the chat's content 
                to help users quickly grasp what the conversation was about.`,
        },
      ],
    })

    if (name) {
      return name.replace(/^"+|"+$/g, "")
    } else {
      // TODO handle error
      console.error("Error: Unexpected response structure from OpenAI API.")
    }

    return name || "New Chat by Error"
  } catch (e) {
    console.error("Error generating chat name:", e)
    return "New Chat by Error"
  }
}

async function generateChatCategory(chatMessage: string, previousAttempt: string | null = null): Promise<string> {
  const apiName = "generateChatCategory"
  const categories = [
    "Information Processing and Management",
    "Communication and Interaction",
    "Decision Support and Advisory",
    "Educational and Training Services",
    "Operational Efficiency and Automation",
    "Finance and Banking",
    "Public Engagement and Services",
    "Innovation and Development",
    "Creative Assistance",
    "Lifestyle and Personal Productivity",
    "Entertainment and Engagement",
    "Emotional and Mental Support",
  ]

  let prompt = `Based on the content of the following message: "${chatMessage}", please categorize it into only one of the specified categories. The response must strictly be one of these exact phrases:\n${categories.join("\n")}\nExample response: "Information Processing and Management"`

  if (previousAttempt !== null) {
    prompt = `The previous attempt to categorize the following message was not successful. The response "${previousAttempt}" did not match any of the expected categories. Please review the message again and categorize it correctly using only one of the specified categories. The expected response must be one of these exact phrases:\n${categories.join("\n")}\nMessage: "${chatMessage}"\nExample response: "Information Processing and Management"`
  }

  try {
    const rawCategory = await GenericChatAPI(apiName, { messages: [{ role: "system", content: prompt }] })

    if (rawCategory) {
      const category = rawCategory.replace(/^"|"$/g, "")
      if (categories.includes(category)) {
        return category
      }
    }

    if (previousAttempt === null) {
      return await generateChatCategory(chatMessage, rawCategory)
    }

    return "Uncategorised"
  } catch (_e) {
    console.log(`Error generating chat category: ${_e}`)
    return "Uncategorised"
  }
}

export async function UpdateChatThreadIfUncategorised(
  chatThread: ChatThreadModel,
  content: string
): Promise<ChatThreadModel> {
  console.log("Updating chat thread if uncategorised for thread:", chatThread.id) // Log the start of the process
  try {
    if (chatThread.chatCategory === "Uncategorised") {
      console.log(
        `Chat thread ${chatThread.id} is uncategorised. Generating new category, name, and storing original name.`
      ) // Log the condition check

      const [chatCategory, name, previousChatName] = await Promise.all([
        generateChatCategory(content),
        generateChatName(content),
        StoreOriginalChatName(chatThread.name),
      ])

      console.log(`New chat category for thread ${chatThread.id}: ${chatCategory}`) // Log the new category
      console.log(`New chat name for thread ${chatThread.id}: ${name}`) // Log the new name
      console.log(`Previous chat name for thread ${chatThread.id}: ${previousChatName}`) // Log the stored previous name

      const response = await UpsertChatThread({ ...chatThread, chatCategory, name, previousChatName })
      console.log(`Upsert response for thread ${chatThread.id}:`, response) // Log the upsert response

      if (response.status !== "OK") {
        console.error(`Failed to upsert chat thread ${chatThread.id}. Errors: ${response.errors.join(", ")}`) // Log if upsert failed
        throw new Error(response.errors.join(", "))
      }
    } else {
      console.log(
        `Chat thread ${chatThread.id} is already categorised as ${chatThread.chatCategory}. No action needed.`
      ) // Log if no action needed
    }
    return chatThread
  } catch (e) {
    console.error("Failed to update chat thread due to an error:", e) // Log caught error
    throw e
  }
}

function StoreOriginalChatName(currentChatName: string): string {
  let previousChatName: string = ""
  if (currentChatName !== previousChatName) {
    console.log(`Storing previous chat name: ${currentChatName}`)
    previousChatName = currentChatName
  }
  return previousChatName
}
