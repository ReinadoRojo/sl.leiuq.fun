import { getLink, plusVisit } from "@/utils/api";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shortUrl = url.searchParams.get("shortUrl");

  // if no short url - error (params.noshorturl)
  if (!shortUrl) return new Response("params.noshorturl", { status: 400 });

  // get the link
  const [link, _err1] = await getLink(shortUrl);
  // if db not found - error (db.notfound)
  if (!link)
    return Response.json(
      { code: "db.notfound", error: "Link not found", data: null },
      { status: 404 }
    );

  // fire visit log event
  await plusVisit(shortUrl);

  // return the link
  return Response.json(
    {
      code: "success",
      error: null,
      data: {
        url: link.longUrl,
      },
    },
    { status: 200 }
  );
}
