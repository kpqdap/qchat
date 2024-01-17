import NextAuth, { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashValue } from "./helpers";
import { JWT } from "next-auth/jwt";

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
            // isAdmin: adminEmails?.includes(profile.email.toLowerCase()) || adminEmails?.includes(profile.preferred_username.toLowerCase())
          }
        }
      }),
    );
  }

  // If we're in local dev, add a basic credential provider option as well
  // (Useful when a dev doesn't have access to create app registration in their tenant)
  // This currently takes any username and makes a user with it, ignores password
  // Refer to: https://next-auth.js.org/configuration/providers/credentials
  if (process.env.NODE_ENV === "development") {
    providers.push(
      CredentialsProvider({
        name: "localdev",
        credentials: {
          username: { label: "Username", type: "text", placeholder: "dev" },
          password: { label: "Password", type: "password" },
        },    
        async authorize(credentials, req): Promise<any> {
          // You can put logic here to validate the credentials and return a user.
          // We're going to take any username and make a new user with it
          // Create the id as the hash of the email as per userHashedId (helpers.ts)
          const username = credentials?.username || "dev";
          const email = username + "@localhost";
          const user = {
              id: hashValue(email),
              name: username,
              email: email,
              isAdmin: false,
              image: "",
            };
          console.log("=== DEV USER LOGGED IN:\n", JSON.stringify(user, null, 2));
          return user;
        }
      })
    );
  }

  return providers;
};

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `expiresIn`. If an error occurs,
 * returns the old token and an error property
 */
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
      return true;
    },
    async jwt({token, user, account, profile, session}) {
      if (user?.isAdmin) {
       token.isAdmin = user.isAdmin
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

      // Access token has expired, try to update it
      return refreshAccessToken(token)
    },
    async session({session, token, user }) {
      session.user.isAdmin = token.isAdmin as string
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 5*60*60, //set session expiry to 5 hours
  },
};

export const handlers = NextAuth(options);

