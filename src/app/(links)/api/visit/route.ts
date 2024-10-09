import { getLink, plusVisit } from "@/utils/turso";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shortUrl = url.searchParams.get("shortUrl");
  if (!shortUrl) return new Response("params.noshorturl", { status: 400 });

  const link = await getLink(shortUrl);
  if (!link) return new Response("db.notfound", { status: 404 });

  await plusVisit(shortUrl);
  return Response.json({ url: link.longUrl }, { status: 200 });
}
