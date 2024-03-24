"use client"

import React from "react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { useMiniMenuContext } from "./mini-menu-context"
import { X, LogIn, LogOut, Moon, Sun, Home, HeartHandshake, Bookmark } from "lucide-react"
import { useTheme } from "next-themes"
import { UrlObject } from "url"
import { cn } from "@/lib/utils"
import { signInProvider } from "@/app-global"

interface MiniMenuItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: UrlObject | string
  icon: React.ElementType
  name: string
  ariaLabel: string
  onClick: () => void
  //not working as expected
}

const MiniMenuItem: React.FC<MiniMenuItemProps> = ({ href, icon: Icon, name, ariaLabel, onClick, ...props }) => {
  const menuItemClass = cn(
    "cursor-pointer px-6 py-2 text-sm hover:bg-accent hover:text-accent-foreground flex items-center whitespace-nowrap",
    props.className
  )

  return (
    <div className={menuItemClass} onClick={onClick} role="button" tabIndex={0} aria-label={ariaLabel}>
      <Icon className="mr-2 size-4" aria-hidden="true" />
      {name}
      <Link href={href} passHref={true}>
        <span className="hidden"></span>
      </Link>
    </div>
  )
}

export const MiniMenu: React.FC = () => {
  const { isMenuOpen, toggleMenu } = useMiniMenuContext()
  const { data: session } = useSession({ required: false })
  const { theme, setTheme } = useTheme()

  const toggleTheme = (): void => setTheme(theme === "light" ? "dark" : "light")

  const menuItems = [
    { name: "Home", href: "/chat", icon: Home, ariaLabel: "Navigate to home page" },
    { name: "Prompt Guides", href: "/prompt-guide", icon: Bookmark, ariaLabel: "Navigate to prompt guides" },
    { name: "Terms of Use", href: "/terms", icon: HeartHandshake, ariaLabel: "Navigate to terms of use" },
    // { name: "What's New", href: '/whats-new', icon: Bell, ariaLabel: "Navigate to what's new page" },
    // { name: 'Settings', href: '/settings', icon: UserCog, ariaLabel: 'Navigate to settings' },
  ]

  const handleMenuClose = (): void => {
    if (isMenuOpen) {
      toggleMenu()
    }
  }

  return (
    <>
      <div
        onClick={toggleMenu}
        className="border-accent text-darkAltButton hover:bg-background h-full cursor-pointer flex-col items-center justify-center hover:underline"
        aria-expanded="false"
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        role="button"
        tabIndex={0}
      >
        {isMenuOpen ? (
          <X className="hover:bg-link items-center" aria-hidden="true" />
        ) : (
          <div className="text-darkAltButton pl-2" aria-hidden="true" />
        )}
        Menu
      </div>
      {isMenuOpen && (
        <div className="bg-altBackground text-link fixed inset-0 z-[99999]" role="dialog" aria-modal="true">
          <div className="absolute right-0 top-0 m-4 h-2/6">
            <div
              onClick={toggleMenu}
              className="hover:bg-accent hover:text-accent-foreground size-[32px] cursor-pointer p-1"
              aria-label="Close menu"
              role="button"
              tabIndex={0}
            >
              <X />
            </div>
          </div>
          <h2 id="menu-heading" className="sr-only">
            Menu
          </h2>
          <div className="mt-16 p-2">
            {menuItems.map(item => (
              <MiniMenuItem key={item.name} onClick={handleMenuClose} {...item} />
            ))}
            <div
              onClick={() => {
                toggleTheme()
                handleMenuClose()
              }}
              className="text-link hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center whitespace-nowrap px-6 py-2 text-sm"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              role="button"
              tabIndex={0}
            >
              {theme === "dark" ? <Sun className="mr-2 size-4" /> : <Moon className="mr-2 size-4" />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </div>
            {session ? (
              <div
                onClick={async () => {
                  await signOut({ callbackUrl: "/" })
                  handleMenuClose()
                }}
                className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center whitespace-nowrap px-6 py-2 text-sm"
                aria-label="Logout"
                role="button"
                tabIndex={0}
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </div>
            ) : (
              <div
                onClick={async () => {
                  await signIn(signInProvider)
                  handleMenuClose()
                }}
                className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center whitespace-nowrap px-6 py-2 text-sm"
                aria-label="Login"
                role="button"
                tabIndex={0}
              >
                <LogIn className="mr-2 size-4" />
                Login
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
