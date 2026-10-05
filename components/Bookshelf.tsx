import { useMemo } from "react";
import type { Theme } from "@/data/themes";
import { BOOK_GAP, buildBookshelf, type BookSpec } from "@/lib/bookshelfEngine";

function bandImage(variant: number, c: string): string {
  switch (variant) {
    case 1:
      return `linear-gradient(transparent 12%, ${c} 12%, ${c} 17%, transparent 17%, transparent 83%, ${c} 83%, ${c} 88%, transparent 88%)`;
    case 2:
      return `linear-gradient(transparent 40%, ${c} 40%, ${c} 46%, transparent 46%, transparent 54%, ${c} 54%, ${c} 60%, transparent 60%)`;
    case 3:
      return `linear-gradient(transparent 22%, ${c} 22%, ${c} 26%, transparent 26%)`;
    default:
      return "";
  }
}

const SHADE =
  "linear-gradient(90deg, rgba(0,0,0,0.32) 0%, rgba(255,255,255,0.10) 22%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.3) 100%)";

function Book({ book, theme }: { book: BookSpec; theme: Theme }) {
  const band = bandImage(book.band, theme.band);
  return (
    <div
      style={{
        flex: "none",
        width: book.w,
        height: `${book.h}%`,
        backgroundColor: theme.spines[book.tone % theme.spines.length],
        backgroundImage: band ? `${band}, ${SHADE}` : SHADE,
        borderRadius: "2px 2px 0 0",
        transform: book.lean ? "rotate(-9deg)" : undefined,
        transformOrigin: "bottom right",
        transition: "width .45s ease, height .45s ease",
      }}
    />
  );
}

export default function Bookshelf({
  count,
  theme,
}: {
  count: number;
  theme: Theme;
}) {
  const layout = useMemo(() => buildBookshelf(count), [count]);

  return (
    <div
      aria-hidden="true"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: `${layout.casePct}%`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          padding: "0 14px",
          background: theme.panelBg,
          border: `10px solid ${theme.caseFrame}`,
          borderRadius: 12,
          boxShadow: "inset 0 10px 26px rgba(0,0,0,0.45)",
          transition: "width .5s ease",
        }}
      >
        {layout.shelves.map((row, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
              alignItems: "flex-end",
              gap: BOOK_GAP,
              paddingTop: 8,
              boxSizing: "border-box",
              borderBottom:
                i === layout.shelves.length - 1
                  ? "none"
                  : `8px solid ${theme.plank}`,
            }}
          >
            {row.map((b) => (
              <Book key={b.id} book={b} theme={theme} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
