"use client"

import React from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import { useMiniMenuContext } from "./mini-menu-context"
import { Menu, X, LogIn, LogOut, Moon, Sun, Home, Bookmark, HeartHandshake } from "lucide-react"
import { useTheme } from "next-themes"
import { Theme } from "../theme/customise"

const getSignInProvider = (): string => (process.env.NODE_ENV === "development" ? "QChatDevelopers" : "azure-ad")

const MiniMenuItem = ({
  href,
  icon: Icon,
  name,
  ariaLabel,
  onClick,
}: {
  href: string
  icon: React.ElementType
  name: string
  ariaLabel: string
  onClick: () => void
}): React.JSX.Element => (
  <Link href={href} passHref>
    <div
      className="flex cursor-pointer items-center whitespace-nowrap px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <Icon className="mr-2 size-4" aria-hidden="true" />
      {name}
    </div>
  </Link>
)

export const MiniMenu = (): React.JSX.Element => {
  const { isMenuOpen, toggleMenu } = useMiniMenuContext()
  const { data: session } = useSession({ required: false })
  const { theme, setTheme } = useTheme()
  const ariaExpanded = isMenuOpen ? "true" : "false"
  const ariaLabel = "Toggle menu"

  const menuItems = [
    { name: "Home", href: "/chat", icon: Home, ariaLabel: "Navigate to home page" },
    { name: "Prompt Guides", href: "/prompt-guide", icon: Bookmark, ariaLabel: "Navigate to prompt guides" },
    { name: "Terms of Use", href: "/terms", icon: HeartHandshake, ariaLabel: "Navigate to terms of use" },
  ]

  const toggleTheme = () => {
    const newTheme = theme === Theme.Light ? Theme.Dark : Theme.Light
    setTheme(newTheme)
  }

  return (
    <>
      <div
        onClick={toggleMenu}
        className="flex cursor-pointer p-4"
        aria-expanded={ariaExpanded}
        aria-label="Toggle menu"
        role="button"
        tabIndex={0}
      >
        {isMenuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
        Menu
      </div>
      {isMenuOpen && (
        <div className="fixed inset-0 z-[99999] bg-altBackgroundShade" role="dialog" aria-modal="true">
          <div className="mt-16 p-2">
            {menuItems.map(item => (
              <MiniMenuItem key={item.name} onClick={toggleMenu} {...item} />
            ))}
            <div
              className="flex cursor-pointer items-center whitespace-nowrap px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                toggleTheme()
                toggleMenu()
              }}
              role="button"
              tabIndex={0}
              aria-label="Toggle theme"
            >
              {theme === Theme.Light ? (
                <Sun className="mr-2 size-4" aria-hidden="true" />
              ) : (
                <Moon className="mr-2 size-4" aria-hidden="true" />
              )}
              Toggle Theme
            </div>
          </div>
          {session ? (
            <Button onClick={() => signOut({ callbackUrl: "/" })}>
              <LogOut className="mr-2 size-4" /> Logout
            </Button>
          ) : (
            <Button onClick={() => signIn(getSignInProvider())}>
              <LogIn className="mr-2 size-4" /> Login
            </Button>
          )}
        </div>
      )}
    </>
  )
}

export default MiniMenu
