import { getLink, plusVisit } from "@/utils/api";
import { error } from "console";
import { notFound } from "next/navigation";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const shortUrl = url.searchParams.get("shorturl");
  if (!shortUrl)
    return Response.json(
      { code: "params.noshorturl", error: "No short url", data: null },
      { status: 400 }
    );

  // get the link
  const [link, _err1] = await getLink(shortUrl);
  if (!link) return notFound();

  // log the visit
  const [plus, _err2] = await plusVisit(shortUrl);
  if (!plus) return notFound();

  // redirect
  return Response.redirect(new URL(link.longUrl as string), 301);
}
