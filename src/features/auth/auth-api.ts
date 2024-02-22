import NextAuth, { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashValue } from "./helpers";
import { JWT } from "next-auth/jwt";
import { UserSignInHandler } from "./sign-in";
import { UserActivity, UserIdentity, UserRecord } from "../user-management/user-cosmos";

const configureIdentityProvider = (): Provider[] => {
  const providers: Provider[] = [];

  const adminEmails = process.env.ADMIN_EMAIL_ADDRESS?.split(",").map(email => email.toLowerCase().trim());

  if (
    process.env.AZURE_AD_CLIENT_ID &&
    process.env.AZURE_AD_CLIENT_SECRET &&
    process.env.AZURE_AD_TENANT_ID
  ) {
    providers.push(
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID!,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
        tenantId: process.env.AZURE_AD_TENANT_ID!,
        wellKnown: process.env.AZURE_AD_OPENID_CONFIGURATION!,
        authorization: {
          url: process.env.AZURE_AD_AUTHORIZATION_ENDPOINT!,
          params: {
            client_id: process.env.AZURE_AD_CLIENT_ID!,
            redirect_uri: process.env.AZURE_AD_REDIRECT_URL!,
            response_type: "code"
          }
        },
        token: {
          url: process.env.AZURE_AD_TOKEN_ENDPOINT!,
          params: {
            client_id: process.env.AZURE_AD_CLIENT_ID!,
            client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
            grant_type: "authorization_code",
            redirect_uri: process.env.AZURE_AD_REDIRECT_URL!,
          }
        },
        userinfo: process.env.AZURE_AD_USERINFO_ENDPOINT!,
        profile: (profile) => {
          const email = profile.email?.toLowerCase();
          const isAdmin = adminEmails?.includes(email);
          return {
            ...profile,
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            upn: profile.upn,
            tenantId: profile.employee_idp,
            isAdmin: isAdmin ? "true" : "false",
          }
        }            
      }),
    );
  }

  if (process.env.NODE_ENV === "development") {
    providers.push(
      CredentialsProvider({
        name: "localdev",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "dev" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
          const username = credentials?.username || "dev";
          const email = username + "@localhost";
          const isAdmin = adminEmails?.includes(email.toLowerCase());
          const employee_idp = "localdev";
          const upn = credentials?.username ? credentials.username : "dev" || "dev";
          const user: UserIdentity = {
            id: hashValue(upn),
            name: username,
            email: email,
            upn: upn,
            tenantId: employee_idp,
            isAdmin: isAdmin ? "true" : "false",
          };
          console.log("=== DEV USER LOGGED IN:\n", JSON.stringify(user, null, 2));
          return {
            ...user,
            isAdmin: user.isAdmin || "false",
          };
        }
      })
    );
  }

  return providers;
};

async function refreshAccessToken(token: JWT) {
  try {
    const tokenUrl = process.env.AZURE_AD_TOKEN_ENDPOINT!;
    const formData = new URLSearchParams({
      client_id: process.env.AZURE_AD_CLIENT_ID!,
      client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken as string,
    });

    const response = await fetch(tokenUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    token.accessToken = refreshedTokens.access_token;
    token.refreshToken = refreshedTokens.refresh_token;
    token.expiresIn = Date.now() + refreshedTokens.expires_in * 1000;
    token.refreshExpiresIn = Date.now() + refreshedTokens.refresh_expires_in * 1000;

    return {
      ...token,
    };
  } catch (e) {
    console.log(e);
    return {
      ...token,
      e: "RefreshAccessTokenError",
    };
  }
}

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [...configureIdentityProvider()],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (profile && user?.tenantId && user?.upn) {
        const userIdentity: UserIdentity = {
          id: hashValue(user?.upn),
          tenantId: user.tenantId,
          email: user?.email ?? '',
          name: user?.name ?? '',
          upn: user.upn,
          isAdmin: user.isAdmin,
        };
      
        const userActivity: UserActivity = {
          last_login: new Date(),
          first_login: new Date(),
          accepted_terms: true,
          accepted_terms_date: new Date().toISOString(),
          failed_login_attempts: 0,
          last_failed_login: null,
        };
        
        const groupsString = ((profile as any).employee_groups as string[])?.join(',');

        const userRecord: UserRecord = {
          ...userIdentity,
          ...userActivity,
        };
      
        try {
          await UserSignInHandler.handleSignIn(userRecord, groupsString);
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      } else {
        console.error("TenantId or upn is missing. Sign-in aborted.");
        return false;
      }
    },
    async jwt({token, user, account, profile, session}) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.tenantId = user.tenantId;
        token.upn = user.upn;
      }
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      if(account){
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresIn = Date.now() + (account as any).expires_in as number * 1000
        token.refreshExpiresIn = Date.now() + (account as any).refresh_expires_in as number * 1000
      }

      if (Date.now() < (token.expiresIn as number)) {
        return token
      }

      if (process.env.NODE_ENV === "development"){
        return token
      }

      return refreshAccessToken(token)
    },
    async session({session, token, user }) {
      session.user.isAdmin = token.isAdmin as string
      session.user.tenantId = token.tenantId as string
      session.user.upn = token.upn as string
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 8*60*60,
  },
};

export const handlers = NextAuth(options);
