import { ChatReportingUI } from "@/features/reporting/chat-reporting-ui";

export default async function Home({ params }: { params: { chatid: string, chatThreadId: string } }) {
  return <ChatReportingUI chatId={params.chatid} chatThreadId={params.chatThreadId} />;
}
