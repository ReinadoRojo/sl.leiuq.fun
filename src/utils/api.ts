import { db, links } from "@/db/schema";
import { uTrack } from "./umami";
import { eq } from "drizzle-orm";
import { create } from "secure-id";

export const cartography = async (l: number) => {
  // 5 digits
  const fiveNumbers = await (
    await fetch(
      `http://www.randomnumberapi.com/api/v1.0/random?min=100&max=9999&count=5`
    )
  ).json();

  // 5 strings
  const fiveStrings = await (
    await fetch(
      `http://www.randomnumberapi.com/api/v1.0/randomstring?min=10&max=20&count=5`
    )
  ).json();

  const result = [];
  for (let i = 0; i < l; i++) {
    result.push(`${fiveNumbers[i]}${fiveStrings[i]}`);
  }

  const { generate } = create(result.join(""))(64);

  const word = Buffer.from(generate()).toString("base64url");
  const wordLength = word.length;

  const startPositon = Math.floor(Math.random() * wordLength - l);
  const endPosition = startPositon + (l % wordLength);

  return word.slice(startPositon, endPosition);
};

export const createLink = async (
  shortUrl: string,
  longUrl: string,
  apiKey: string
): Promise<[boolean, string | null | undefined]> => {
  try {
    await db
      .insert(links)
      .values({
        shortUrl,
        longUrl,
        apikeyOrigin: apiKey,
      })
      .execute();

    await uTrack("createLink", {
      apiKey,
      url: longUrl,
    });

    return [true, null];
  } catch (err) {
    return [false, "Something went wrong when creating the link"];
  }
};

export const getLink = async (
  shortUrl: string
): Promise<[any | null, string | null | undefined]> => {
  try {
    const dbResult = await db
      .select({
        id: links.id,
        shortUrl: links.shortUrl,
        longUrl: links.longUrl,
      })
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .execute();

    if (!dbResult || dbResult.length === 0)
      return [null, "We could not find the data in the database"];

    return [dbResult[0], null];
  } catch (err) {
    return [null, "Error ocurred while trying to get link."];
  }
};

export const plusVisit = async (
  shortUrl: string
): Promise<[boolean, string | null | undefined]> => {
  try {
    const dbResult = await db
      .select({
        id: links.id,
        visits: links.visits,
      })
      .from(links)
      .where(eq(links.shortUrl, shortUrl))
      .execute();

    if (!dbResult) return [false, "Error"];

    const newVisits = dbResult[0].visits + 1;

    await db
      .update(links)
      .set({
        visits: newVisits,
      })
      .where(eq(links.id, dbResult[0].id))
      .execute();

    await uTrack("visit", {
      shortUrl: shortUrl?.toString(),
    });

    return [true, null];
  } catch (_) {
    await uTrack("visitLink_error", {
      shortUrl: shortUrl?.toString(),
    });

    return [false, "Error ocurred while tracking visit."];
  }
};
