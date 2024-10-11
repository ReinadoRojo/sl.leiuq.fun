import { apiTokens, db } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getApiKeysByOwnerId = async (ownerId: string) => {
  const dbResult = await db
    .select({
      apiToken: apiTokens.apiToken,
    })
    .from(apiTokens)
    .where(eq(apiTokens.ownerId, ownerId))
    .execute();
  if (dbResult.length === 0) return [];

  let censoredTokens: Array<any> = [];
  dbResult.forEach((tkn) => {
    const censoredToken =
      tkn.apiToken.substring(0, 5) + "*".repeat(tkn.apiToken.length - 5);
    censoredTokens.push({ apiToken: censoredToken });
  });

  return censoredTokens;
};
