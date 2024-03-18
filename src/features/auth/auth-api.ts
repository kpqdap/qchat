import NextAuth, { NextAuthOptions } from "next-auth"
import { Provider } from "next-auth/providers"
import AzureADProvider from "next-auth/providers/azure-ad"
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
          profile.secGroups = profile.employee_groups
          if (process.env.NODE_ENV === "development") {
            profile.tenantId = profile.tid
            profile.secGroups = profile.groups
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
    async signIn({ user }): Promise<boolean> {
      if (!user?.tenantId || !user?.upn) return false
      try {
        const groups = user?.secGroups ?? []
        return await UserSignInHandler.handleSignIn(user, groups)
      } catch (error) {
        console.error("Error in signIn callback", error)
        return false
      }
    },
    jwt({ token, user }) {
      const authToken = token as AuthToken
      if (user) {
        authToken.qchatAdmin = user.qchatAdmin ?? false
        authToken.tenantId = user.tenantId ?? ""
        authToken.upn = user.upn ?? ""
      }
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
