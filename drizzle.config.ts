import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.NEXT_TURSO_DB_URL as string,
    authToken: process.env.NEXT_TURSO_DB_AUTH_TOKEN as string,
  }
});