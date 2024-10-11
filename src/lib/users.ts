import { db, users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getUserByEmail = async (tEmail: string) => {
    const dbResult = await db.select().from(users).where(eq(users.email, tEmail)).execute()

    if(dbResult.length === 1) return dbResult[0]
    else return null
}