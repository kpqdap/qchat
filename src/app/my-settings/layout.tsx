import { AI_NAME } from "@/features/theme/customise";
import { UserSettingsMenu } from "@/features/user-management/user-menu";
import { UserSettings } from "@/features/user-management/menu-items";

export const dynamic = "force-dynamic";

export const metadata = {
  title: AI_NAME + " - My Settings",
  description: AI_NAME,
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <>
      <div className="flex-1 flex overflow-hidden bg-card">
        {/* Ensure UserSettingsMenu is designed to accept and render children */}
        <UserSettingsMenu>
          {children}
        </UserSettingsMenu>
      </div>
    </>
  );
}

