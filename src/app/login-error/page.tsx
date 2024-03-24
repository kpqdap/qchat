"use client"

import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardDescription } from "@/features/ui/card"
import { Button } from "@/features/ui/button"
import { AI_NAME } from "@/features/theme/theme-config"
import { ErrorType } from "@/features/auth/auth-api"

const ErrorPage: React.FC = () => {
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState("")
  const [displaySupportButton, setDisplaySupportButton] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const errorType = urlParams.get("error") as ErrorType | null

    let message = ""
    switch (errorType) {
      case ErrorType.NoTenant:
        message = `It looks like your agency is not yet set up for using ${AI_NAME}, please contact your Agency IT Support Team or CIO to discuss using QChat.`
        setDisplaySupportButton(false)
        break
      case ErrorType.NotAuthorised:
        message = `Your Agency is using ${AI_NAME}, however, it appears as if you are not in one of the permitted groups, please contact your agency IT support team to request additional details or how to gain access. `
        setDisplaySupportButton(false)
        break
      case ErrorType.SignInFailed:
      default:
        message = `Currently, access to ${AI_NAME} is only available to onboarded agencies, if you are seeing this warning it usually means your agency has not completed their setup. If you believe your agency has been setup and continue to receive these errors, please contact your agency IT support team.`
        setDisplaySupportButton(true)
        break
    }

    setErrorMessage(message)
  }, [])

  const handleSupportRedirect = (): void => {
    void router.push("/support")
  }

  // New function to redirect to the ForGov URL
  const handleForGovRedirect = (): void => {
    window.location.href =
      "https://www.forgov.qld.gov.au/information-and-communication-technology/qchat/qchat-assistant"
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="flex min-w-[300px] max-w-[700px] flex-col gap-2">
        <CardHeader className="items-center justify-center gap-2">
          Uh-oh we ran into an error signing you in!
          <CardDescription className="items-center justify-center">{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="grid items-center justify-center gap-4">
          {displaySupportButton && (
            <Button className="max-w-[300px]" onClick={handleSupportRedirect}>
              Contact QChat Support
            </Button>
          )}
          <Button className="max-w-[300px]" onClick={handleForGovRedirect}>
            Find out more about QChat on ForGov
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ErrorPage
