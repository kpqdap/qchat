import { ChatMenu } from "@/features/chat/chat-menu/chat-menu"
import { ChatMenuContainer } from "@/features/chat/chat-menu/chat-menu-container"
import { AI_NAME } from "@/features/theme/customise"

export const dynamic = "force-dynamic"

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
}

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <div className="bg-card/100 grid h-full grid-cols-6 overflow-hidden">
        <ChatMenuContainer>
          <ChatMenu />
        </ChatMenuContainer>
        {children}
      </div>
    </>
  )
}
