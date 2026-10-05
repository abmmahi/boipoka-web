import { SITE_URL } from "./site";

export function buildCaption(bookCount: number): string {
  return [
    "এটাই আমার Reading Identity 📚",
    `আমি এখন পর্যন্ত ${bookCount}টি বই পড়েছি।`,
    "তুমি কেমন পাঠক?",
    "",
    `তোমারটাও তৈরি করো — Boipoka\n${SITE_URL}`,
  ].join("\n");
}

export type ShareResult = "shared" | "cancelled" | "unsupported";

export async function shareImage(
  blob: Blob,
  filename: string,
  caption: string,
): Promise<ShareResult> {
  if (typeof navigator === "undefined" || !navigator.share) return "unsupported";
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  if (!navigator.canShare || !navigator.canShare({ files: [file] })) {
    return "unsupported";
  }
  try {
    await navigator.share({ files: [file], text: caption });
    return "shared";
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return "cancelled";
    }
    return "unsupported";
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
