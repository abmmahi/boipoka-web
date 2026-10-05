import { forwardRef } from "react";
import Bookshelf from "./Bookshelf";
import { getTheme, type ThemeId } from "@/data/themes";
import { getGenre } from "@/data/genres";
import { getReadingTitle } from "@/data/readingTitles";
import type { SelectedAuthor } from "@/data/authors";
import { getInitials } from "@/lib/utils";
import { SITE_HOST } from "@/lib/site";

export interface CardData {
  name: string;
  photo: string | null;
  bookCount: number;
  authors: SelectedAuthor[];
  genreIds: string[];
  themeId: ThemeId;
}

const DISPLAY = '"Playfair Display", "Noto Serif Bengali", Georgia, serif';
const BN_SERIF = '"Noto Serif Bengali", "Playfair Display", Georgia, serif';
const UI = '"Hind Siliguri", system-ui, sans-serif';

function nameSize(len: number): number {
  if (len <= 10) return 92;
  if (len <= 16) return 76;
  if (len <= 22) return 62;
  return 52;
}

/**
 * The card is ALWAYS laid out at 1080 x 1080. The on-screen preview simply
 * scales it down; the export captures it at its native size.
 */
const ReadingCard = forwardRef<HTMLDivElement, { data: CardData }>(
  function ReadingCard({ data }, ref) {
    const theme = getTheme(data.themeId);
    const title = getReadingTitle(data.bookCount);
    const displayName = data.name.trim() || "তোমার নাম";
    const hasName = data.name.trim().length > 0;
    const initials = getInitials(data.name);
    const genres = data.genreIds
      .map((id) => getGenre(id))
      .filter((g) => g !== undefined);

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: 1080,
          height: 1080,
          boxSizing: "border-box",
          overflow: "hidden",
          padding: "62px 70px 50px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: theme.cardBg,
          color: theme.ink,
          fontFamily: UI,
          transition: "background .5s ease, color .5s ease",
        }}
      >
        {theme.texture && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: theme.texture,
              pointerEvents: "none",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            inset: 26,
            border: `1.5px solid ${theme.line}`,
            borderRadius: 30,
            pointerEvents: "none",
          }}
        />

        {/* Brand mark (quiet) */}
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 22,
            letterSpacing: "0.5em",
            paddingLeft: "0.5em",
            color: theme.accent,
            lineHeight: 1,
          }}
        >
          BOIPOKA
        </div>

        {/* Avatar */}
        <div
          style={{
            marginTop: 24,
            width: 118,
            height: 118,
            borderRadius: "50%",
            border: `3px solid ${theme.accent}`,
            boxSizing: "border-box",
            overflow: "hidden",
            background: theme.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: "none",
          }}
        >
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo}
              alt={`${displayName}-এর প্রোফাইল ছবি`}
              width={118}
              height={118}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : initials ? (
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 46,
                fontWeight: 600,
                color: theme.avatarInk,
                lineHeight: 1.3,
              }}
            >
              {initials}
            </span>
          ) : (
            <svg
              width="52"
              height="52"
              viewBox="0 0 24 24"
              fill="none"
              stroke={theme.avatarInk}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
              <path d="M20 19v2H6.5" />
            </svg>
          )}
        </div>

        {/* Name */}
        <div
          style={{
            marginTop: 14,
            width: "100%",
            textAlign: "center",
            fontFamily: BN_SERIF,
            fontWeight: 600,
            fontSize: nameSize(Array.from(displayName).length),
            lineHeight: 1.32,
            textTransform: "uppercase",
            overflowWrap: "anywhere",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            opacity: hasName ? 1 : 0.55,
          }}
        >
          {displayName}
        </div>

        {/* Reading title */}
        <div
          style={{
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            gap: 22,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <span style={{ height: 1.5, width: 90, background: theme.line }} />
          <span
            style={{
              fontFamily: BN_SERIF,
              fontWeight: 600,
              fontSize: 40,
              lineHeight: 1.5,
              color: theme.accent,
              whiteSpace: "nowrap",
            }}
          >
            {title.bn}
          </span>
          <span style={{ height: 1.5, width: 90, background: theme.line }} />
        </div>
        <div
          style={{
            fontFamily: DISPLAY,
            fontSize: 18,
            letterSpacing: "0.32em",
            paddingLeft: "0.32em",
            textTransform: "uppercase",
            color: theme.muted,
            lineHeight: 1.4,
          }}
        >
          {title.en}
        </div>

        {/* Bookshelf */}
        <div style={{ flex: 1, minHeight: 0, width: "100%", marginTop: 22 }}>
          <Bookshelf count={data.bookCount} theme={theme} />
        </div>

        {/* Books read */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <span
            style={{
              fontFamily: DISPLAY,
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 1.1,
              color: theme.accent,
            }}
          >
            {data.bookCount}
          </span>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 500, lineHeight: 1.4 }}>
              বই পড়া হয়েছে
            </span>
            <span
              style={{
                fontFamily: DISPLAY,
                fontSize: 16,
                letterSpacing: "0.32em",
                color: theme.muted,
                lineHeight: 1.5,
              }}
            >
              BOOKS READ
            </span>
          </span>
        </div>

        {/* Literary DNA */}
        <div
          style={{
            marginTop: 14,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 16,
              letterSpacing: "0.4em",
              paddingLeft: "0.4em",
              color: theme.muted,
              lineHeight: 1.4,
            }}
          >
            MY LITERARY DNA
          </div>
          <div
            style={{
              fontFamily: BN_SERIF,
              fontSize: 29,
              fontWeight: 500,
              lineHeight: 1.45,
              textAlign: "center",
              opacity: data.authors.length ? 1 : 0.45,
            }}
          >
            {data.authors.length
              ? data.authors.map((a) => a.short).join("  ·  ")
              : "তোমার প্রিয় লেখকদের বেছে নাও"}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 10,
              minHeight: 44,
            }}
          >
            {genres.length ? (
              genres.map((g) => (
                <span
                  key={g.id}
                  style={{
                    fontSize: 21,
                    lineHeight: 1.4,
                    padding: "3px 18px",
                    borderRadius: 999,
                    border: `1.5px solid ${theme.line}`,
                    color: theme.ink,
                  }}
                >
                  {g.bn}
                </span>
              ))
            ) : (
              <span style={{ fontSize: 21, opacity: 0.45, lineHeight: 1.6 }}>
                প্রিয় জনরা বেছে নাও
              </span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 12,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div
            style={{
              fontSize: 20,
              lineHeight: 1.5,
              color: theme.muted,
              letterSpacing: "0.02em",
            }}
          >
            বইপোকা · তোমার বইপড়ার পরিচয়
          </div>
          <div
            style={{
              fontFamily: DISPLAY,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: theme.accent,
              lineHeight: 1.4,
            }}
          >
            {SITE_HOST}
          </div>
        </div>
      </div>
    );
  },
);

export default ReadingCard;
