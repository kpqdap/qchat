import NextAuth, { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashValue } from "./helpers";
import { JWT } from "next-auth/jwt";
import { UserSignInHandler } from "./sign-in";

const configureIdentityProvider = () => {
  const providers: Array<Provider> = [];

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
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            grantType: "authorization_code",
            redirect_uri: process.env.AZURE_AD_REDIRECT_URL!,
          }
        },
        userinfo: process.env.AZURE_AD_USERINFO_ENDPOINT!,
        profileUrl: process.env.AZURE_AD_USERINFO_ENDPOINT!,
        profile: (profile) => {
          return {
            ...profile,
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            // isAdmin: adminEmails?.includes(profile.email.toLowerCase()) || adminEmails?.includes(profile.preferred_username.toLowerCase()),
            upn: profile.upn,
            tenantId: profile.employee_idp,
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
          username: { label: "Username", type: "string", placeholder: "dev" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req): Promise<any> {
          const username = credentials?.username || "dev";
          const email = username + "@localhost";
          const employee_idp = "localdev";
          const upn = credentials?.username || "dev";
          const user = {
            id: hashValue(upn),
            name: username,
            email: email,
            isAdmin: false,
            image: "",
            employee_idp,
            upn,
            tenantId: "localdev"
          };
          console.log("=== DEV USER LOGGED IN:\n", JSON.stringify(user, null, 2));
          
          return user;
        }
      })
    );
  }

  return providers;
};

async function refreshAccessToken(token: JWT) {
  try{
    const tokenUrl = process.env.AZURE_AD_TOKEN_ENDPOINT!

    const formData = new URLSearchParams({
      client_id: process.env.AZURE_AD_CLIENT_ID!,
      client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken as string
    })

    const response = await fetch(tokenUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    token.accessToken = refreshedTokens.access_token,
    token.refreshToken = refreshedTokens.refresh_token,
    token.expiresIn = Date.now() + (refreshedTokens as any).expires_in as number * 1000,
    token.refreshExpiresIn = Date.now() + (refreshedTokens as any).refresh_expires_in as number * 1000

    return {
      ...token,
    }  

  } 
  catch(e){
    console.log(e)
    return {
      ...token,
      e: "RefreshAccessTokenError",
    }
  }
}

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [...configureIdentityProvider()],
  callbacks: {
    async signIn({user, account, profile}) {
      if(profile){
        (user as any).upn = (profile as any).upn as string
        (user as any).tenantId = (profile as any).employee_idp as string
        if(process.env.ACCESS_GROUPS_REQUIRED === "true"){
          const allowedGroupGUIDs = process.env.ACCESS_GROUPS.split(",").map(group => group.trim());
          const userGroupGUIDs = ((profile as any).employee_groups as []) || [];
          const isMemberOfAllowedGroup = userGroupGUIDs.some(group => allowedGroupGUIDs.includes(group));
          if (!isMemberOfAllowedGroup){
            return false
          }
        }
      const userRecord = {
        id: hashValue(user.id),
        email: user.email,
        name: user.name,
        upn: (profile as any).upn as string,
        tenantId: (profile as any).employee_idp as string,
        last_login: new Date().toISOString(),
      };
        try {
          await UserSignInHandler.handleSignIn(userRecord);
          return true; // Sign-in successful
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Sign-in failed
        }
      }
      return true;
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

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresIn as number)) {
        return token
      }

      // Return token for dev session only
      if (process.env.NODE_ENV === "development"){
        return token
      }

      // Access token has expired, try to update it
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
    maxAge: 8*60*60, //set session expiry to 5 hours
  },
};

export const handlers = NextAuth(options);
