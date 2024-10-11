import { random as nbRandom } from "next-basics";
import { cartography, createLink } from "@/utils/api";

export async function POST(request: Request) {
  try {
    // get needed
    const requestUrl = new URL(request.url);
    const apiKey = requestUrl.searchParams.get("apikey");

    // check needed
    if (!apiKey) return new Response("unauthorized.noapikey", { status: 401 });
    if (apiKey != process.env.SECRET_API_KEY)
      return new Response("unauthorized.apikey", { status: 401 });

    // get body
    const body = await request.json();

    // check body

    // if no body - error no found (body.notfound)
    if (!body)
      return Response.json(
        { code: "body.notfound", error: "No body on request", data: null },
        { status: 400 }
      );

    // if no url on body - error invalid (body.invalid)
    if (!body.url)
      return Response.json(
        { code: "body.invalid", error: "Invalid body", data: null },
        { status: 400 }
      );

    // parse url and validate
    const url = new URL(body.url);
    if (!url.hostname)
      return Response.json(
        { code: "body.url.invalid", error: "Body URL malformed", data: null },
        { status: 500 }
      );

    // plan ideal length
    const idealLength =
      url.hostname.length > 10
        ? 10
        : url.hostname.length < 6
        ? 6
        : url.hostname.length;

    // random number between 6 and idealLength
    const shortUrl = await cartography(nbRandom(6, idealLength));

    // creating the link
    const [succesLink, errorMessage] = await createLink(
      shortUrl,
      body.url,
      apiKey
    );

    // if not succesful - error on db creation (internal.db.creation)
    if (!succesLink)
      return Response.json(
        { code: "internal.db.creation", error: errorMessage, data: null },
        { status: 500 }
      );

    // if no errrors - all success (success - 200)
    return Response.json(
      {
        code: "success",
        error: null,
        data: {
          shortUrl: shortUrl,
          complete: `${requestUrl.protocol}//${requestUrl.host}/${shortUrl}`,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { code: "internal.general", error: "Unknown error ocurred", data: null },
      { status: 500 }
    );
  }
}
