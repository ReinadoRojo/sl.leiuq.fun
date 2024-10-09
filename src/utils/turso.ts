import { Client, createClient } from "@libsql/client/http";
import { uTrack } from "./umami";

export function tursoClient(): Client {
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

  return createClient({
    url: process.env.NEXT_TURSO_DB_URL as string,
    authToken: process.env.NEXT_TURSO_DB_AUTH_TOKEN as string,
  });
}

export const getLink = async (shortUrl: string) => {
  try {
    const result = await tursoClient().execute({
      sql: "SELECT * FROM links WHERE shortUrl = ?",
      args: [shortUrl],
    });

    return result.rows[0];
  } catch (_) {
    return null;
  }
};

export const plusVisit = async (shortUrl: string) => {
  try {
    await tursoClient().execute({
      sql: "UPDATE links SET visits = visits + 1 WHERE shortUrl = ?",
      args: [shortUrl],
    });

    await uTrack("visitLink", {
      shortUrl: shortUrl?.toString(),
    });

    return true;
  } catch (_) {
    await uTrack("visitLink_error", {
      shortUrl: shortUrl?.toString(),
    });

    return false;
  }
};

export const createLink = async (
  shortUrl: string,
  longUrl: string,
  apiKey: string
) => {
  try {
    await tursoClient().execute({
      sql: "INSERT INTO links (shortUrl, longurl, apiKeyOrigin) VALUES (?, ?, ?)",
      args: [shortUrl, longUrl, apiKey],
    });

    await uTrack("createLink", {
      apiKey: apiKey,
      url: longUrl,
    });

    return true;
  } catch (_) {
    return false;
  }
};

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
    result.push(`${fiveNumbers[i]}-${fiveStrings[i]}`);
  }

  const word = Buffer.from(result.join(":")).toString("base64url");
  const wordLength = word.length;

  const startPositon = Math.floor(Math.random() * wordLength - l);
  const endPosition = startPositon + (l % wordLength);

  return word.slice(startPositon, endPosition);
};
