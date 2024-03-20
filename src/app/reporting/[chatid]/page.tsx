import { ChatReportingUI } from "@/features/reporting/chat-reporting-ui"

export default async function Home({
  params,
}: {
  params: { chatid: string; chatThreadId: string }
}): Promise<JSX.Element> {
  return <ChatReportingUI chatThreadId={params.chatThreadId} />
}
