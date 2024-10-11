"use server";

import { db, links } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getLinksByApiKey = async (selectedToken: string) => {
  const dbResult = await db
    .select({
      id: links.id,
      shortUrl: links.shortUrl,
      longUrl: links.longUrl,
    })
    .from(links)
    .where(eq(links.apikeyOrigin, selectedToken));

  return dbResult;
};

export const getLinksByOwnerId = async (ownerId: string) => {
  const dbResult = await db
    .select({
      id: links.id,
      shortUrl: links.shortUrl,
      longUrl: links.longUrl,
      visits: links.visits,
    })
    .from(links)
    .where(eq(links.ownerId, ownerId));

  return dbResult;
};