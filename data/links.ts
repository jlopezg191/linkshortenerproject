import { eq } from "drizzle-orm";

import { db } from "@/db";
import { links } from "@/db/schema";

export async function getUserLinks(userId: string) {
  return await db
    .select()
    .from(links)
    .where(eq(links.clerk_user_id, userId))
    .orderBy(links.created_at, "desc");
}
