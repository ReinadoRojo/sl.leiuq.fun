import { integer, sqliteTable, text, primaryKey, foreignKey, uniqueIndex, unique } from "drizzle-orm/sqlite-core"
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"
import type { AdapterAccountType } from "next-auth/adapters"

import { create } from "secure-id"
import { generateToken } from "@/utils/tokens"
const { generate: idGenerate } = create('wertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLÑZXCVBNM')(16)
 
const url = process.env.NEXT_TURSO_DB_URL?.trim();
if (url === undefined) {
throw new Error("TURSO_DB_URL is not defined");
}

const authToken = process.env.NEXT_TURSO_DB_AUTH_TOKEN?.trim();
if (authToken === undefined) {
if (!url.includes("file:")) {
    throw new Error("TURSO_DB_AUTH_TOKEN is not defined");
}
}

const client = createClient({
    url: process.env.NEXT_TURSO_DB_URL as string,
    authToken: process.env.NEXT_TURSO_DB_AUTH_TOKEN as string,
});

export const db = drizzle(client)


//
// Schema
//

export const users = sqliteTable("user", {
  id: text("id")
    .primaryKey().$defaultFn(() => idGenerate()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})
 
export const accounts = sqliteTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})
 
export const verificationTokens = sqliteTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
 
export const authenticators = sqliteTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp", {
      mode: "boolean",
    }).notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const links = sqliteTable("links", {
    id: text("id", { mode: "text" }).primaryKey().$defaultFn(() => idGenerate()),
    shortUrl: text("shortUrl", { mode: "text" }).notNull(),
    longUrl: text("longUrl", { mode: "text" }).notNull(),
    apiKeyOrigin: text("apiKeyOrigin", { mode: "text" }).notNull(),
    visits: integer("visits", { mode: "number" }) .notNull().default(0),
}, (table) => ({
    unque_shortUrl: unique("shortUrl").on(table.shortUrl),
}))

export const apiTokens = sqliteTable("apiTokens", {
    id: text("id", { mode: "text" }).primaryKey().$defaultFn(() => idGenerate()),
    apiToken: text("apiToken", { mode: "text" }).notNull().$defaultFn(() => generateToken()),
    ownerId: text("ownerId", { mode: "text" }).notNull().references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
}, (tb) => ({
    unq_apiToken: unique("apiToken").on(tb.apiToken),
    unq_idx_ownerId: uniqueIndex("ownerId").on(tb.ownerId),
}))