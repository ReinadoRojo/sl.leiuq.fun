import { apiTokens, db } from "@/db/schema";
import { eq } from "drizzle-orm";

import { create } from "secure-id"
const { generate: idGenerate, validate: idValidate } = create('wertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLÑZXCVBNM;:_,.-\'ç*+`^"}{][?¡!"·$%&/()=ªº\\')(36)
const gPrefix = "sl";

export const generateToken = () => {
    const raw = idGenerate();
    const token = `${gPrefix}_${Buffer.from(raw).toString("hex")}`;
    return token;
}

/**
 * 
 * @param token
 * @returns [success, error]
 */
export const validateToken = async (token: string): Promise<[boolean, string | null | undefined]> => {
    const [prefix, hex] = token.split("_");

    if(!prefix || !hex || prefix !== gPrefix) {
        return [false, "Invalid token format"];
    }

    const raw = Buffer.from(hex, "hex").toString();
    if(!idValidate(raw)) {
        return [false, "Invalid token content"];
    }

    // check db
    const dbResults = await db.select().from(apiTokens).where(eq(apiTokens.apiToken, token)).execute();

    if(dbResults.length === 0) {
        return [false, "Invalid token"];
    }

    return [true, null];
}