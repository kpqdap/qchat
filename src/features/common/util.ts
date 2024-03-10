import { customAlphabet } from "nanoid"
import { ChatThreadModel } from "../chat/chat-services/models"

export const uniqueId = (): string => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const nanoid = customAlphabet(alphabet, 36)
  return nanoid()
}

export const sortByTimestamp = (a: ChatThreadModel, b: ChatThreadModel): number => {
  return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
}
