import { clamp, mulberry32 } from "./utils";

/**
 * Bookshelf engine
 * ----------------
 * bookCount -> visible books -> shelf count -> density -> composition.
 * We never render one element per book for huge counts: visible books are
 * capped (MAX_VISIBLE) and the *density* of the shelf communicates quantity.
 */

export interface BookSpec {
  id: number;
  w: number; // px width
  h: number; // % of shelf height
  tone: number; // index into theme.spines
  band: number; // spine decoration variant 0..3
  lean: boolean; // last book of a loose shelf leans on its neighbour
}

export interface BookshelfLayout {
  visibleBooks: number;
  shelfCount: number;
  density: "sparse" | "balanced" | "dense";
  casePct: number; // bookcase width, % of the panel
  shelves: BookSpec[][];
}

export const BOOK_GAP = 2;
const MAX_VISIBLE = 228;
const CASE_INNER_PX = 860; // nominal usable width at 100%
const TONES = 8;

function shelfCountFor(visible: number): number {
  if (visible <= 10) return 2;
  if (visible <= 24) return 3;
  if (visible <= 48) return 4;
  if (visible <= 90) return 5;
  return 6;
}

export function buildBookshelf(bookCount: number): BookshelfLayout {
  const visible = clamp(Math.round(bookCount), 0, MAX_VISIBLE);
  const shelfCount = shelfCountFor(visible);
  const casePct = clamp(34 + visible * 0.66, 40, 100);
  const usable = (CASE_INNER_PX * casePct) / 100;
  const fill = 0.62 + 0.33 * Math.min(1, visible / 170);

  const base = Math.floor(visible / shelfCount);
  const extra = visible % shelfCount;

  const shelves: BookSpec[][] = [];
  let index = 0;

  for (let s = 0; s < shelfCount; s++) {
    const m = base + (s < extra ? 1 : 0);
    const avg = m > 0 ? clamp((usable * fill) / m, 14, 34) : 0;
    const row: BookSpec[] = [];

    for (let k = 0; k < m; k++) {
      const rnd = mulberry32(index * 9973 + 101);
      row.push({
        id: index,
        w: avg * (0.78 + 0.44 * rnd()),
        h: 62 + rnd() * 32,
        tone: Math.floor(rnd() * TONES),
        band: Math.floor(rnd() * 4),
        lean: false,
      });
      index++;
    }

    // keep the row inside the bookcase
    const total = row.reduce((sum, b) => sum + b.w + BOOK_GAP, 0);
    const limit = usable * 0.98;
    if (total > limit && total > 0) {
      const f = limit / total;
      row.forEach((b) => (b.w = b.w * f));
    }

    // a loose shelf gets one leaning book at the end
    const used = row.reduce((sum, b) => sum + b.w + BOOK_GAP, 0);
    if (row.length >= 4 && used < usable * 0.8) {
      row[row.length - 1].lean = true;
    }

    shelves.push(row);
  }

  const density: BookshelfLayout["density"] =
    visible < 30 ? "sparse" : visible < 110 ? "balanced" : "dense";

  return { visibleBooks: visible, shelfCount, density, casePct, shelves };
}
