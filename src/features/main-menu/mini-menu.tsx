"use client"

// Importing necessary libraries and components
import React from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useMiniMenuContext } from "./mini-menu-context"
import { Menu, X, LogIn, LogOut, Home } from "lucide-react"
import { useTheme } from "next-themes"
import { Theme } from "../theme/theme-provider"

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
  <div
    className="cursor-pointer px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center whitespace-nowrap"
    onClick={onClick}
    role="button"
    tabIndex={0}
    aria-label={ariaLabel}
  >
    <Icon className="size-4 mr-2" aria-hidden="true" />
    {name}
    <Link href={href} passHref>
      <span className="hidden"></span>
    </Link>
  </div>
)

export const MiniMenu = (): React.JSX.Element => {
  const { isMenuOpen, toggleMenu } = useMiniMenuContext()
  const { data: session } = useSession({ required: false })
  const { theme, setTheme } = useTheme()

  const toggleTheme = (): void => setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)

  const menuItems = [
    { name: "Home", href: "/chat", icon: Home, ariaLabel: "Navigate to home page" },
    // Future menu items can be added here
  ]

  return (
    <>
      <div
        onClick={toggleMenu}
        className="cursor-pointer flex p-4 ..."
        aria-expanded={isMenuOpen ? "true" : "false"}
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        role="button"
        tabIndex={0}
      >
        {isMenuOpen ? <X className="..." aria-hidden="true" /> : <Menu size={16} className="..." aria-hidden="true" />}
        Menu
      </div>
      {isMenuOpen && (
        <div className="fixed top-0 right-0 bottom-0 left-0 z-[99999] ..." role="dialog" aria-modal="true">
          <div className="p-2 mt-16">
            {menuItems.map(item => (
              <MiniMenuItem
                key={item.name}
                onClick={() => {
                  toggleMenu()
                  toggleTheme()
                }}
                {...item}
              />
            ))}
            {session ? (
              <button onClick={() => signOut({ callbackUrl: "/" })} className="...">
                <LogOut className="size-4 mr-2" /> Logout
              </button>
            ) : (
              <button onClick={() => signIn(getSignInProvider())} className="...">
                <LogIn className="size-4 mr-2" /> Login
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
