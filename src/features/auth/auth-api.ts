import NextAuth, { NextAuthOptions } from "next-auth"
import { Provider } from "next-auth/providers"
import AzureADProvider from "next-auth/providers/azure-ad"
import { hashValue } from "./helpers"
import { JWT } from "next-auth/jwt"
import { UserSignInHandler } from "./sign-in"

export interface AuthToken extends JWT {
  qchatAdmin?: boolean
  exp: number
  iat: number
  refreshExpiresIn: number
}

const configureIdentityProvider = (): Provider[] => {
  const providers: Provider[] = []
  const adminEmails = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map(email => email.toLowerCase().trim()) || []

  if (process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET && process.env.AZURE_AD_TENANT_ID) {
    providers.push(
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID,
        wellKnown: process.env.AZURE_AD_OPENID_CONFIGURATION,
        authorization: {
          url: process.env.AZURE_AD_AUTHORIZATION_ENDPOINT,
          params: {
            client_id: process.env.AZURE_AD_CLIENT_ID,
            redirect_uri: process.env.AZURE_AD_REDIRECT_URL,
            response_type: "code",
          },
        },
        token: {
          url: process.env.AZURE_AD_TOKEN_ENDPOINT,
          params: {
            client_id: process.env.AZURE_AD_CLIENT_ID,
            client_secret: process.env.AZURE_AD_CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: process.env.AZURE_AD_REDIRECT_URL,
          },
        },
        userinfo: process.env.AZURE_AD_USERINFO_ENDPOINT,
        profile: profile => {
          const email = profile.email != undefined ? profile.email?.toLowerCase() : profile.upn.toLowerCase()
          const qchatAdmin = adminEmails.includes(email)
          profile.tenantId = profile.employee_idp
          if (process.env.NODE_ENV === "development") {
            profile.tenantId = profile.tid
          }
          return {
            ...profile,
            id: profile.sub,
            name: profile.name,
            email: profile.email ?? profile.upn,
            upn: profile.upn,
            qchatAdmin: qchatAdmin,
            userId: profile.upn,
          }
        },
      })
    )
  }
  return providers
}

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [...configureIdentityProvider()],
  callbacks: {
    async signIn({ user, account }): Promise<boolean> {
      if (!user?.tenantId || !user?.upn) return false

      try {
        const accessToken = account?.access_token ?? ""
        return await UserSignInHandler.handleSignIn(user, accessToken)
      } catch (error) {
        console.error("Error in signIn callback", error)
        return false
      }
    },
    jwt({ token, user, account }) {
      const authToken = token as AuthToken
      if (user) {
        authToken.qchatAdmin = user.qchatAdmin ?? false
        authToken.tenantId = user.tenantId ?? ""
        authToken.upn = user.upn ?? ""
      }
      if (account && account.access_token && account.refresh_token) {
        const expiresIn = Number(account.expires_in ?? 0)
        const refreshExpiresIn = Number(account.refresh_expires_in ?? 0)
        authToken.accessToken = account.access_token
        authToken.refreshToken = account.refresh_token
        authToken.expiresIn = Date.now() + expiresIn * 1000
        authToken.refreshExpiresIn = Date.now() + refreshExpiresIn * 1000
      }
      // if (authToken.refreshToken && typeof authToken.expiresIn === "number" && Date.now() > authToken.expiresIn) {
      //   authToken = await refreshAccessToken(authToken)
      // }
      return authToken
    },
    session({ session, token }) {
      const authToken = token as AuthToken
      session.user.qchatAdmin = authToken.qchatAdmin ?? false
      session.user.tenantId = authToken.tenantId ? String(authToken.tenantId) : ""
      session.user.upn = authToken.upn ? String(authToken.upn) : ""
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60,
  },
}

export const handlers = NextAuth(options)
