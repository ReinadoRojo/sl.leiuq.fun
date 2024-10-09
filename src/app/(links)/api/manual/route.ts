import { getLink, plusVisit } from "@/utils/turso";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shortUrl = url.searchParams.get("shorturl");
  if (!shortUrl) return new Response("params.noshorturl", { status: 400 });

  // get the link
  const link = await getLink(shortUrl);
  if (!link) return notFound();

  // log the visit
  const plus = await plusVisit(shortUrl);
  if (!plus) return notFound();

  // redirect
  return Response.redirect(new URL(link.longUrl as string), 301);
}
