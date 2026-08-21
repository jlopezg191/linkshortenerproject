export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { links } from "@/db/schema";

export async function GET(req: Request, { params }: { params: { shortcode: string } }) {
  const shortcode = params.shortcode;

  if (!shortcode) {
    return NextResponse.json({ error: "Missing shortcode" }, { status: 400 });
  }

  // Find the link by short_code
  const found = await db.select().from(links).where(eq(links.short_code, shortcode));

  if (!found || found.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const link = found[0];

  // Respect active flag and expiration
  if (!link.is_active) {
    return NextResponse.json({ error: "Link inactive" }, { status: 410 });
  }

  if (link.expires_at && new Date(link.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ error: "Link expired" }, { status: 410 });
  }

  // Increment clicks (best-effort)
  try {
    const newClicks = (Number(link.clicks) || 0) + 1;
    await db.update(links).set({ clicks: newClicks }).where(eq(links.id, link.id));
  } catch (e) {
    console.warn("Failed to increment clicks for", shortcode, e);
  }

  // Redirect to the stored URL
  try {
    return NextResponse.redirect(link.url, 307);
  } catch (e) {
    return NextResponse.json({ error: "Invalid target URL" }, { status: 500 });
  }
}
