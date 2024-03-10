"use client"

import { Button } from "@/features/ui/button"
import { LayoutDashboard, PanelLeftClose, PanelRightClose, Home } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "../theme/theme-toggle"
import { UserProfile } from "../user-profile"
import { useSession } from "next-auth/react"
import { useMenuContext } from "./menu-context"

export const MainMenu = (): JSX.Element => {
  const { data: session } = useSession()
  const { isMenuOpen, toggleMenu } = useMenuContext()
  return (
    <div className="flex flex-col justify-between p-2">
      <div className="flex gap-2  flex-col  items-center">
        <Button onClick={toggleMenu} variant={"menuRound"}>
          {isMenuOpen ? <PanelLeftClose /> : <PanelRightClose />}
        </Button>
        <Button asChild variant={"menuRound"}>
          <Link href="/" title="Home">
            <Home />
          </Link>
        </Button>
        {session?.user?.qchatAdmin && (
          <Button asChild variant={"menuRound"}>
            <Link href="/reporting" title="Reporting">
              <LayoutDashboard />
            </Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col gap-2 items-center">
        <ThemeToggle />
        <UserProfile />
      </div>
    </div>
  )
}
