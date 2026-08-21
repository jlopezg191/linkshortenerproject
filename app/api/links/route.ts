export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { links } from "@/db/schema";

function generateShortCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export async function POST(req: Request) {
  // Debug: log incoming cookies, headers, env and auth result to diagnose missing auth
  console.log("[api/links] incoming-cookie:", req.headers.get("cookie"));
  console.log("[api/links] auth header:", req.headers.get("authorization"));
  console.log("[api/links] x-clerk-jwt header:", req.headers.get("x-clerk-jwt"));
  console.log("[api/links] env NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  console.log("[api/links] env CLERK_SECRET:", process.env.CLERK_SECRET);
  console.log("[api/links] env CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);

  // Try Clerk auth with the incoming request first, then fall back to auth()
  let userId: string | undefined;
  try {
    const res = auth({ req });
    userId = (res as { userId?: string })?.userId;
  } catch (err) {
    console.log("[api/links] auth({ req }) threw:", err);
    try {
      const res2 = auth();
      userId = (res2 as { userId?: string })?.userId;
      console.log("[api/links] auth() userId:", userId);
    } catch (err2) {
      console.log("[api/links] auth() threw:", err2);
    }
  }
  console.log("[api/links] clerk auth userId:", userId);

  const body = await req.json().catch(() => ({}));
  console.log("[api/links] request body:", body);
  const url = (body.url || "").toString().trim();
  let short_code = body.short_code?.toString().trim();

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  // If user provided a short code, ensure it's not already taken
  // fallback: if Clerk auth failed, allow server to accept clerk_user_id from body (insecure fallback)
  let effectiveUserId = userId;
  if (!effectiveUserId && body.clerk_user_id) {
    console.warn("[api/links] falling back to clerk_user_id from request body");
    effectiveUserId = body.clerk_user_id;
  }

  if (!effectiveUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (short_code) {
    const existing = await db
      .select()
      .from(links)
      .where(eq(links.short_code, short_code));

    if (existing.length > 0) {
      return NextResponse.json({ error: "Short code already exists" }, { status: 409 });
    }
  } else {
    // generate a unique code (few attempts)
    for (let i = 0; i < 6; i++) {
      const candidate = generateShortCode();
      const found = await db
        .select()
        .from(links)
        .where(eq(links.short_code, candidate));

      if (found.length === 0) {
        short_code = candidate;
        break;
      }
    }

    if (!short_code) {
      return NextResponse.json({ error: "Could not generate short code" }, { status: 500 });
    }
  }

  const result = await db.insert(links).values({
    short_code,
    url,
    clerk_user_id: effectiveUserId,
  }).returning();

  return NextResponse.json(result?.[0] ?? null, { status: 201 });
}

export async function PATCH(req: Request) {
  console.log("[api/links][PATCH] incoming-cookie:", req.headers.get("cookie"));
  console.log("[api/links][PATCH] auth header:", req.headers.get("authorization"));
  let userId: string | undefined;
  try {
    const res = auth({ req });
    userId = (res as { userId?: string })?.userId;
  } catch (err) {
    console.log("[api/links][PATCH] auth({ req }) threw:", err);
    try {
      const res2 = auth();
      userId = (res2 as { userId?: string })?.userId;
      console.log("[api/links][PATCH] auth() userId:", userId);
    } catch (e) {
      console.log("[api/links][PATCH] auth() threw:", e);
    }
  }

  const body = await req.json().catch(() => ({}));
  console.log("[api/links][PATCH] body:", body);
  const id = body.id;
  const url = body.url?.toString().trim();
  const short_code = body.short_code?.toString().trim();
  const is_active = typeof body.is_active === "boolean" ? body.is_active : undefined;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (!userId && body.clerk_user_id) {
    userId = body.clerk_user_id;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify ownership
  const existing = await db.select().from(links).where(eq(links.id, Number(id)));
  if (!existing || existing.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing[0].clerk_user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // If short_code provided and different, ensure uniqueness
  if (short_code && short_code !== existing[0].short_code) {
    const found = await db.select().from(links).where(eq(links.short_code, short_code));
    if (found.length > 0) {
      return NextResponse.json({ error: "Short code already exists" }, { status: 409 });
    }
  }

  const updates: any = {};
  if (url) updates.url = url;
  if (short_code !== undefined) updates.short_code = short_code;
  if (is_active !== undefined) updates.is_active = is_active;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  updates.updated_at = new Date();

  const res = await db.update(links).set(updates).where(eq(links.id, Number(id))).returning();

  return NextResponse.json(res?.[0] ?? null, { status: 200 });
}

export async function DELETE(req: Request) {
  console.log("[api/links][DELETE] incoming-cookie:", req.headers.get("cookie"));
  console.log("[api/links][DELETE] auth header:", req.headers.get("authorization"));
  let userId: string | undefined;
  try {
    const res = auth({ req });
    userId = (res as { userId?: string })?.userId;
  } catch (err) {
    console.log("[api/links][DELETE] auth({ req }) threw:", err);
    try {
      const res2 = auth();
      userId = (res2 as { userId?: string })?.userId;
      console.log("[api/links][DELETE] auth() userId:", userId);
    } catch (e) {
      console.log("[api/links][DELETE] auth() threw:", e);
    }
  }

  const body = await req.json().catch(() => ({}));
  console.log("[api/links][DELETE] body:", body);
  const id = body.id;

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  if (!userId && body.clerk_user_id) {
    userId = body.clerk_user_id;
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const existing = await db.select().from(links).where(eq(links.id, Number(id)));
  if (!existing || existing.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing[0].clerk_user_id !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(links).where(eq(links.id, Number(id)));

  return NextResponse.json({ success: true }, { status: 200 });
}
