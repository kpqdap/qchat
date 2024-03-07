import { AI_NAME } from "@/features/theme/customise"
import { UserSettingsMenu } from "@/features/user-management/user-menu"

export const dynamic = "force-dynamic"

export const metadata = {
  title: AI_NAME + " - Settings",
  description: AI_NAME,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid h-full w-full grid-cols-6 overflow-hidden bg-card">
        <UserSettingsMenu />
        {children}
      </div>
    </>
  )
}
