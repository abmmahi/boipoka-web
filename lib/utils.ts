export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

// Small deterministic random generator: same seed -> same sequence.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export function toBengaliDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

function firstGrapheme(s: string): string {
  if (!s) return "";
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter !== "undefined") {
    const seg = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    for (const part of seg.segment(s)) return part.segment;
  }
  return Array.from(s)[0] ?? "";
}

// "ABM MAHI" -> "AM", "মাহি" -> "মা", "" -> ""
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = firstGrapheme(parts[0]);
  const last = parts.length > 1 ? firstGrapheme(parts[parts.length - 1]) : "";
  return (first + last).toUpperCase();
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, " ").replace(/^\s+/, "").slice(0, 28);
}
