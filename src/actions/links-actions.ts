"use server";

import { auth } from "@/auth";
import { db, links } from "@/db/schema";
import { getUserByEmail } from "@/lib/users";
import { cartography } from "@/utils/api";
import { random } from "next-basics";
import { notFound } from "next/navigation";

export const makeLongShort = async (formData: FormData) => {
  const longUrl = formData.get("longurl");

  const session = await auth();
  if (!session?.user) return notFound();

  console.log(session.user)

  const user = await getUserByEmail(session.user.email!)
  const userId = user?.id;

  let url;
  try {
      // Create a new URL object and validate the longUrl
      url = new URL(longUrl?.toString()!);
  } catch (error) {
      return {
      code: "web.links.create.urlinvalid",
      error: "Invalid URL",
      data: null,
      };
  }

  // Generate a random short URL using the ideal length
  const shortUrl = await cartography(random(6, 10));

  // Try inserting into the database and catch potential errors
  try {
      console.log({
      longUrl: url.toString(),
      shortUrl: shortUrl,
      ownerId: userId,
      })
      
      await db.insert(links).values({
      longUrl: url.toString(),
      shortUrl: shortUrl,
      ownerId: userId,
      }).execute();

      return {
      code: "success",
      error: null,
      data: {
          shortUrl: shortUrl,
          complete: null, // don't send complete link if it's on the web
      },
      };
  } catch (error) {
      console.error("Database insertion error: ", error);
      return {
      code: "web.links.create.general",
      error: "A error blocked us to create the link",
      data: null,
      };
  }
}