import { random as nbRandom } from "next-basics";
import { cartography, createLink } from "@/utils/turso";

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url);
    const apiKey = requestUrl.searchParams.get("apikey");
    if (!apiKey) return new Response("unauthorized.noapikey", { status: 401 });
    if (apiKey != process.env.SECRET_API_KEY)
      return new Response("unauthorized.apikey", { status: 401 });

    const body = await request.json();
    if (!body) return new Response("body.notfound", { status: 400 });
    if (!body.url) return new Response("body.incorrect", { status: 400 });

    const url = new URL(body.url);
    if (!url.hostname) return new Response("body.url.invalid", { status: 400 });

    const idealLength =
      url.hostname.length > 10
        ? 10
        : url.hostname.length < 6
        ? 6
        : url.hostname.length;

    // random number between 6 and idealLength
    const shortUrl = await cartography(nbRandom(6, idealLength));

    const result = await createLink(shortUrl, body.url, apiKey);
    if (!result) return new Response("internal.db.creation", { status: 500 });

    return Response.json(
      {
        status: "ok",
        shortUrl: shortUrl,
        complete: `${requestUrl.protocol}//${requestUrl.host}/${shortUrl}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return new Response("internal.general", { status: 500 });
  }
}
