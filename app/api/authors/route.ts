import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import {
  authorKey,
  cleanAuthorName,
  findBuiltIn,
  validateAuthorName,
  type CommunityAuthor,
  type CommunityCategory,
} from "@/lib/authorKeys";

export const dynamic = "force-dynamic";

const HASH = "boipoka:authors";
const MAX_TOTAL = 3000;
const MAX_ADDS_PER_HOUR = 8;

interface Stored {
  name: string;
  category: CommunityCategory;
  token: string;
  createdAt: number;
}

function asStored(v: unknown): Stored | null {
  try {
    const o = typeof v === "string" ? JSON.parse(v) : v;
    if (o && typeof o === "object" && "name" in o && "category" in o) {
      return o as Stored;
    }
  } catch {
    /* ignore broken rows */
  }
  return null;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

// ---- list all community authors (never exposes delete tokens) ----
export async function GET() {
  const redis = getRedis();
  if (!redis) return json({ enabled: false, authors: [] });

  try {
    const all = await redis.hgetall<Record<string, unknown>>(HASH);
    const list: (CommunityAuthor & { createdAt: number })[] = [];
    for (const [key, v] of Object.entries(all ?? {})) {
      const s = asStored(v);
      if (s) {
        list.push({
          key,
          name: s.name,
          category: s.category,
          createdAt: s.createdAt ?? 0,
        });
      }
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    return json({
      enabled: true,
      authors: list.map(({ key, name, category }) => ({ key, name, category })),
    });
  } catch {
    return json({ enabled: false, authors: [] });
  }
}

// ---- add a new author for everyone ----
export async function POST(req: Request) {
  const redis = getRedis();
  if (!redis) return json({ error: "unavailable" }, 503);

  let body: { name?: unknown; category?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "ভুল অনুরোধ।" }, 400);
  }

  const name = cleanAuthorName(String(body.name ?? ""));
  const category: CommunityCategory | null =
    body.category === "bangla" || body.category === "international"
      ? body.category
      : null;
  if (!category) return json({ error: "লেখকের ধরন বেছে নাও।" }, 400);

  const problem = validateAuthorName(name);
  if (problem) return json({ error: problem }, 400);

  const built = findBuiltIn(name);
  if (built) return json({ error: "exists-builtin", builtInId: built.id }, 409);

  try {
    // simple per-visitor limit so the shared list can't be flooded
    const ip = (req.headers.get("x-forwarded-for") ?? "unknown")
      .split(",")[0]
      .trim();
    const rlKey = `boipoka:rl:${ip}`;
    const used = await redis.incr(rlKey);
    if (used === 1) await redis.expire(rlKey, 3600);
    if (used > MAX_ADDS_PER_HOUR) {
      return json(
        { error: "এক ঘণ্টায় অনেক নাম যোগ করা হয়েছে। একটু পরে আবার চেষ্টা করো।" },
        429,
      );
    }

    const key = authorKey(name);
    const existing = asStored(await redis.hget(HASH, key));
    if (existing) {
      return json({
        author: { key, name: existing.name, category: existing.category },
        existed: true,
      });
    }

    if ((await redis.hlen(HASH)) >= MAX_TOTAL) {
      return json({ error: "তালিকা এখন পূর্ণ। পরে আবার চেষ্টা করো।" }, 507);
    }

    const token = crypto.randomUUID();
    const row: Stored = { name, category, token, createdAt: Date.now() };
    await redis.hset(HASH, { [key]: JSON.stringify(row) });
    return json({ author: { key, name, category }, token });
  } catch {
    return json({ error: "এই মুহূর্তে সংরক্ষণ করা যাচ্ছে না।" }, 500);
  }
}

// ---- the person who added a name can undo it (typo etc.) ----
export async function DELETE(req: Request) {
  const redis = getRedis();
  if (!redis) return json({ error: "unavailable" }, 503);
  try {
    const { key, token } = (await req.json()) as { key?: string; token?: string };
    if (!key || !token) return json({ error: "ভুল অনুরোধ।" }, 400);
    const row = asStored(await redis.hget(HASH, key));
    if (!row || row.token !== token) return json({ error: "মুছতে পারলাম না।" }, 403);
    await redis.hdel(HASH, key);
    return json({ ok: true });
  } catch {
    return json({ error: "মুছতে পারলাম না।" }, 500);
  }
}
