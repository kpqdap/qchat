import { customAlphabet } from "nanoid"

export const uniqueId = (): string => {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  const nanoid = customAlphabet(alphabet, 36)
  return nanoid()
}
