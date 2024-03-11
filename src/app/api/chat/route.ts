import { chatAPIEntry } from "@/features/chat/chat-services/chat-api-entry"

const delay = (ms: number | undefined): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export async function GET(req: Request): Promise<Response> {
  const body = await req.json()

  const maxRetries = 2
  const retryDelay = 5000
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await chatAPIEntry(body)
      return response
    } catch (error: unknown) {
      const errorStatus = (error as { status: number })?.status

      switch (errorStatus) {
        case 400:
          return new Response("Oops! Something went wrong with your request.", { status: 400 })
        case 401:
          return new Response("Access denied. Please ensure your credentials are correct.", { status: 401 })
        case 402:
          return new Response("Whoops, looks like you've exceeded your limit! Please try again later.", { status: 402 })
        case 403:
          return new Response("Sorry, we're unable to fulfill your request.", { status: 403 })
        case 429:
          return new Response("Hold on! Too many requests at the moment, please try again after a while.", {
            status: 429,
          })
        default:
          if (attempt === maxRetries || errorStatus !== 504) {
            return new Response("Our apologies, we're facing some internal issues currently.", { status: 500 })
          }
      }
      await delay(retryDelay)
    }
  }
  return new Response("We're sorry, the server timed-out after several retries.", { status: 504 })
}
