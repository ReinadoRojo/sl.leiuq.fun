import { apiTokens, db, links } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getLinksByApiKey = async (selectedToken: string) => {
    const dbResult = await db.select({
        id: links.id,
        shortUrl: links.shortUrl,
        longUrl: links.longUrl
    }).from(links).where(eq(links.apiKeyOrigin, selectedToken))

    return dbResult
}