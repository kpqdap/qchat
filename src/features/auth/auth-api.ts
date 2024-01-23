import NextAuth, { Account, NextAuthOptions } from "next-auth";
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
        profile: (profile, tokens) => {
          return {
            ...profile,
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            isAdmin: adminEmails?.includes(profile.email.toLowerCase()) || adminEmails?.includes(profile.preferred_username.toLowerCase()),
            groups: (tokens.idTokenClaims as any)?.groups || [],
          }
        }
      })
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
        async authorize(credentials, req): Promise<any> {
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

async function refreshAccessToken(token: JWT) {
  try {
    const tokenUrl = process.env.AZURE_AD_TOKEN_ENDPOINT!;
    const formData = new URLSearchParams({
        client_id: process.env.AZURE_AD_CLIENT_ID!,
        client_secret: process.env.AZURE_AD_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string
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

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token,
      expiresIn: Date.now() + (refreshedTokens as any).expires_in * 1000,
      refreshExpiresIn: Date.now() + (refreshedTokens as any).refresh_expires_in * 1000
    };
  } catch (e) {
    console.log(e);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const options: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: configureIdentityProvider(),
  callbacks: {
    async signIn({user, account, profile}) {
      if(process.env.ACCESS_GROUPS_REQUIRED === "true"){
        console.log((account as Account).group)
        const allowedGroupGUIDs = process.env.ACCESS_GROUPS.split(",").map(group => group.trim());
        const userGroupGUIDs = ((account as Account).group as []) || [];
        const isMemberOfAllowedGroup = userGroupGUIDs.some(group => allowedGroupGUIDs.includes(group));
        if (!isMemberOfAllowedGroup){
          return false
        }
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // if (account?.idTokenClaims?.groups) {
      //   token.groups = account.idTokenClaims.groups;
      // }
      if (user?.isAdmin) {
        token.isAdmin = user.isAdmin;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresIn = Date.now() + (account as any).expires_in * 1000;
        token.refreshExpiresIn = Date.now() + (account as any).refresh_expires_in * 1000;
      }
      if (Date.now() < (token.expiresIn as number)) {
        return token;
      }
      if (process.env.NODE_ENV === "development") {
        return token;
      }
      return refreshAccessToken(token);
    },
    // async signIn({ user, account, profile, token }) {
    //   if (process.env.ACCESS_GROUPS_REQUIRED === "true") {
    //     const allowedGroupGUIDs = process.env.ACCESS_GROUPS?.split(",").map(group => group.trim());
    //     const userGroupGUIDs = token.groups || [];
    //     const isMemberOfAllowedGroup = userGroupGUIDs.some(group => allowedGroupGUIDs.includes(group));
    //     if (!isMemberOfAllowedGroup) {
    //       return false;
    //     }
    //   }
    //   return true;
    // },
    async session({ session, token, user }) {
      // session.user.isAdmin = token.isAdmin as boolean;
      return session;
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 5 * 60 * 60, // set session expiry to 5 hours
  },
};

export const handlers = NextAuth(options);
