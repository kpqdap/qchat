import { ChatThreadModel } from "@/features/chat/chat-services/models"
import { clsx, type ClassValue } from "clsx"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const uniqueId = (): string => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const nanoid = customAlphabet(alphabet, 36)
  return nanoid()
}

export const sortByTimestamp = (a: ChatThreadModel, b: ChatThreadModel): number => {
  return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}
