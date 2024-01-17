import { ChatMenu } from "@/features/chat/chat-menu/chat-menu";
import { ChatMenuContainer } from "@/features/chat/chat-menu/chat-menu-container";
import { MainMenu } from "@/features/main-menu/menu";
import { AI_NAME } from "@/features/theme/customise";

export const dynamic = "force-dynamic";

export const metadata = {
  title: AI_NAME,
  description: AI_NAME,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex-1 flex overflow-hidden bg-card/100">
        <ChatMenuContainer>
          <ChatMenu />
        </ChatMenuContainer>
        {children}
      </div>
    </>
  );
}
