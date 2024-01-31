import NextAuth, { DefaultSession } from "next-auth"

// https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth" {

    interface Session {
        user: {
            isAdmin: string;
            tenantId: string;
            upn: string;
        } & DefaultSession["user"]
    }
    interface User {
        isAdmin: string;
        tenantId: string;
        upn: string;
    }
}
