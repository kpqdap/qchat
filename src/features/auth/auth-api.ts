import NextAuth, { NextAuthOptions } from "next-auth";
import { Provider } from "next-auth/providers";
import AzureADProvider from "next-auth/providers/azure-ad";
import CredentialsProvider from "next-auth/providers/credentials";
import { hashValue } from "./helpers";

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
        wellKnown: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/.well-known/openid-configuration",
        authorization: {
          url: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/auth",
          params: {
            client_id: process.env.AZURE_AD_CLIENT_ID!,
            redirect_uri: "https://qchat-dev.ai.qld.gov.au/api/auth/callback/azure-ad", 
            response_type: "code"
          }
        },
        token: {
          url: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token",
          params: {
            client_id: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            grantType: "authorization_code",
            redirect_uri: "https://qchat-dev.ai.qld.gov.au/api/auth/callback/azure-ad",
          }
        },
        async profile(profile) {

          const newProfile = {
            ...profile,
            // throws error without this - unsure of the root cause (https://stackoverflow.com/questions/76244244/profile-id-is-missing-in-google-oauth-profile-response-nextauth)
            id: profile.sub,
            isAdmin: adminEmails?.includes(profile.email.toLowerCase()) || adminEmails?.includes(profile.preferred_username.toLowerCase()),
            name: profile.tuo_account?.profile.nickname,
            email: profile.tuo_account?.email,
            image: profile.tuo_account?.profile.profile_image_url,
          }
          return newProfile;
        }
      }),
      // {
      //   id: "azure-ad",
      //   name: "azure-ad",
      //   type: "oauth",
      //   version: '2.0',
      //   clientId: process.env.AZURE_AD_CLIENT_ID!,
      //   clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      //   // authorization: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/auth" + new URLSearchParams({
      //   //   redirect_uri: "https://qchat-dev.ai.qld.gov.au/api/auth/signin/azure-ad", 
      //   //   response_type: "code"
      //   // }),
      //   // token: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token" + new URLSearchParams({
      //   //   grantType: "authorization_code",
      //   //   redirect_uri: "https://qchat-dev.ai.qld.gov.au/api/auth/signin/azure-ad"
      //   // }),
      //   authorization: {
      //     url: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/auth",
      //     params: {
      //       redirect_uri: "https://qchat-dev.ai.qld.gov.au/api/auth/signin/azure-ad", 
      //       response_type: "code"
      //     }
      //   },
      //   token: {
      //     url: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/token",
      //     params: {
      //       grantType: "authorization_code",
      //       redirect_uri: "https://qchat-dev.ai.qld.gov.au/api/auth/signin/azure-ad"
      //     }
      //   },
      //   userinfo: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/userinfo",
      //   profileUrl: "https://www.uat.auth.qld.gov.au/auth/realms/tell-us-once/protocol/openid-connect/userinfo",
      //   profile: (profile) => {
      //     return {
      //       ...profile,
      //       id: profile.sub,
      //       name: profile.name,
      //       email: profile.email,
      //       isAdmin: adminEmails?.includes(profile.email.toLowerCase()) || adminEmails?.includes(profile.preferred_username.toLowerCase())
      //     }
      //   }
      // }
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

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [...configureIdentityProvider()],
  callbacks: {
    async signIn({user, account, profile}) {
      console.log("user", user, account, profile);
      return true;
    },
    async jwt({token, user, account, profile, isNewUser, session}) {
      if (user?.isAdmin) {
       token.isAdmin = user.isAdmin
      }
      if(account){
        token.accessToken = account.access_token
        console.log(token.accessToken)
        console.log(profile)
      }
      console.log(token)
      return token
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
