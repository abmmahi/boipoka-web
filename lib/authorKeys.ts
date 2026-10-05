import { authors } from "@/data/authors";

export type CommunityCategory = "bangla" | "international";

export interface CommunityAuthor {
  key: string;
  name: string;
  category: CommunityCategory;
}

const NAME_RE = /^[\p{L}\p{M}\u200c\u200d .'’\-]+$/u;
const LINK_RE = /(https?|www\.|\.com|\.net|\.org|\.xyz|\.bd|\.info)/i;

/** Same name typed in different ways -> same key. */
export function authorKey(name: string): string {
  return name
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\s.'’\-\u200c\u200d]+/g, " ")
    .trim();
}

export function cleanAuthorName(raw: string): string {
  return raw.normalize("NFC").replace(/\s+/g, " ").trim();
}

/** Returns a Bengali error message, or null when the name is acceptable. */
export function validateAuthorName(name: string): string | null {
  const len = Array.from(name).length;
  if (len < 2) return "নামটা অন্তত ২ অক্ষরের হতে হবে।";
  if (len > 40) return "নাম সর্বোচ্চ ৪০ অক্ষরের হতে পারে।";
  if (!NAME_RE.test(name) || LINK_RE.test(name)) {
    return "নামে শুধু অক্ষর, স্পেস, ডট (.) আর হাইফেন (-) ব্যবহার করা যাবে।";
  }
  return null;
}

/** Built-in author whose name matches, if any (so we don't create duplicates). */
export function findBuiltIn(name: string) {
  const k = authorKey(name);
  return authors.find(
    (a) =>
      authorKey(a.name) === k ||
      authorKey(a.bn) === k ||
      authorKey(a.short) === k,
  );
}
