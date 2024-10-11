import {
  db,
  users,
  sessions,
  authenticators,
  verificationTokens,
  accounts,
} from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import type { NextAuthConfig } from "next-auth";
export const authConfig = {
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ request, auth }) {
      const isAuthenticated = !!auth?.user;

      return isAuthenticated;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
