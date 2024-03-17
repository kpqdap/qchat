import { ChatAPIData } from "./chat-api-data"
import { ChatAPISimple } from "./chat-api-simple"
import { PromptGPTProps } from "./models"

export const chatAPIEntry = async (props: PromptGPTProps): Promise<Response> => {
  const dataChatTypes = ["data", "mssql", "audio"]

  if (props.chatType === "simple") {
    return ChatAPISimple(props)
  } else if (dataChatTypes.includes(props.chatType)) {
    return ChatAPIData(props)
  } else {
    // Default case, assuming "simple" as a fallback
    return ChatAPISimple(props)
  }
}
