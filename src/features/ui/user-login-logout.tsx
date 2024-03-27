"use client"

import React from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { LogIn, LogOut } from "lucide-react"
import Typography from "@/components/typography"
import { Button } from "@/features/ui/button"
import { signInProvider } from "@/app-global"

export const UserComponent: React.FC = () => {
  const { data: session, status } = useSession({ required: false })

  if (status === "loading") {
    return <div className="flex h-[32px] w-full items-center justify-center opacity-50">Loading...</div>
  }

  return (
    <div>
      {session ? (
        <Button
          onClick={async () => await signOut({ callbackUrl: "/" })}
          className="flex items-center text-white"
          aria-label="Log out"
          variant="link"
        >
          <LogOut className="text-darkAltButton mr-2" size={20} aria-hidden="true" />
          <Typography variant="span">Log out</Typography>
        </Button>
      ) : (
        <Button
          onClick={async () => await signIn(signInProvider, { callbackUrl: "/" })}
          className="flex items-center text-white"
          aria-label="Log in"
          variant="link"
        >
          <LogIn className="text-darkAltButton mr-2" size={20} aria-hidden="true" />
          <Typography variant="span">Log in</Typography>
        </Button>
      )}
    </div>
  )
}
