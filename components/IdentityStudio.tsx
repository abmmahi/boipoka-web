"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReadingCard, { type CardData } from "./ReadingCard";
import ProfileSection from "./ProfileSection";
import BookCountSelector from "./BookCountSelector";
import AuthorSelector from "./AuthorSelector";
import GenreSelector from "./GenreSelector";
import ThemeSelector from "./ThemeSelector";
import DownloadActions, { type Notice } from "./DownloadActions";
import PrivacyNote from "./PrivacyNote";
import { getAuthor, toSelected, type SelectedAuthor } from "@/data/authors";
import { themes, defaultThemeId, type ThemeId } from "@/data/themes";
import { renderCard, saveBlob, type ExportFormat } from "@/lib/cardGenerator";
import { buildCaption, copyText, shareImage } from "@/lib/shareUtils";

const CARD = 1080;

// A beautiful demo identity, so the card never looks empty.
const DEMO_AUTHORS: SelectedAuthor[] = ["humayun-ahmed", "tagore", "dan-brown"]
  .map((id) => getAuthor(id))
  .filter((a) => a !== undefined)
  .map(toSelected);

function CardPreview({
  data,
  cardRef,
}: {
  data: CardData;
  cardRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / CARD);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-[0_18px_50px_-18px_rgba(40,22,8,0.55)]"
      role="img"
      aria-label="তোমার Reading Identity কার্ডের লাইভ প্রিভিউ"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: CARD,
          height: CARD,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: scale ? 1 : 0,
        }}
      >
        <ReadingCard ref={cardRef} data={data} />
      </div>
    </div>
  );
}

export default function IdentityStudio() {
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [bookCount, setBookCount] = useState(27);
  const [authors, setAuthors] = useState<SelectedAuthor[]>(DEMO_AUTHORS);
  const [genreIds, setGenreIds] = useState<string[]>([
    "fiction",
    "mystery",
    "poetry",
  ]);
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [previewOut, setPreviewOut] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const previewAnchor = useRef<HTMLDivElement>(null);

  const data: CardData = useMemo(
    () => ({ name, photo, bookCount, authors, genreIds, themeId }),
    [name, photo, bookCount, authors, genreIds, themeId],
  );

  // Floating "Preview" button on small screens when the card scrolls away
  useEffect(() => {
    const el = previewAnchor.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setPreviewOut(!entry.isIntersecting),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const fileBase = useCallback(() => {
    const safe = name.trim().replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 24);
    return `boipoka-${safe || "reading-identity"}`;
  }, [name]);

  const caption = useCallback(() => buildCaption(bookCount), [bookCount]);

  async function makeBlob(format: ExportFormat): Promise<Blob | null> {
    if (!cardRef.current) return null;
    try {
      return await renderCard(cardRef.current, format);
    } catch {
      setNotice({
        kind: "error",
        text: "ছবি তৈরি করা গেল না। আরেকবার চেষ্টা করো, অথবা Chrome/Safari-এর নতুন ভার্সনে খুলে দেখো।",
      });
      return null;
    }
  }

  async function handleDownload(format: ExportFormat) {
    setBusy(true);
    setNotice(null);
    const blob = await makeBlob(format);
    if (blob) {
      saveBlob(blob, `${fileBase()}.${format}`);
      setNotice({ kind: "ok", text: "ছবি ডাউনলোড হয়েছে।" });
    }
    setBusy(false);
  }

  async function handleShare() {
    setBusy(true);
    setNotice(null);
    const blob = await makeBlob("png");
    if (blob) {
      const result = await shareImage(blob, `${fileBase()}.png`, caption());
      if (result === "unsupported") {
        saveBlob(blob, `${fileBase()}.png`);
        const copied = await copyText(caption());
        setNotice({
          kind: "ok",
          text: copied
            ? "ছবি ডাউনলোড হয়েছে আর ক্যাপশন কপি হয়েছে। এখন Facebook বা Instagram-এ পোস্ট করো।"
            : "ছবি ডাউনলোড হয়েছে। এখন সেটা Facebook বা Instagram-এ পোস্ট করো।",
        });
      }
    }
    setBusy(false);
  }

  async function handleCopyCaption() {
    const ok = await copyText(caption());
    setNotice(
      ok
        ? { kind: "ok", text: "ক্যাপশন কপি হয়েছে।" }
        : { kind: "error", text: "কপি করা গেল না। নিজে সিলেক্ট করে কপি করো।" },
    );
  }

  function surprise() {
    const others = themes.filter((t) => t.id !== themeId);
    const pick = others[Math.floor(Math.random() * others.length)];
    if (pick) setThemeId(pick.id);
  }

  return (
    <div
      id="studio"
      className="mx-auto grid w-full max-w-6xl scroll-mt-4 gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:items-start"
    >
      {/* Card first on mobile, right column on desktop */}
      <div className="order-first lg:order-last lg:sticky lg:top-6">
        <div ref={previewAnchor}>
          <CardPreview data={data} cardRef={cardRef} />
        </div>
        <DownloadActions
          busy={busy}
          notice={notice}
          onShare={handleShare}
          onDownload={handleDownload}
          onCopyCaption={handleCopyCaption}
        />
        <PrivacyNote />
      </div>

      <div className="flex flex-col gap-5">
        <ProfileSection
          name={name}
          photo={photo}
          onName={setName}
          onPhoto={setPhoto}
        />
        <BookCountSelector count={bookCount} onChange={setBookCount} />
        <AuthorSelector selected={authors} onChange={setAuthors} />
        <GenreSelector selected={genreIds} onChange={setGenreIds} />
        <ThemeSelector
          value={themeId}
          onChange={setThemeId}
          onSurprise={surprise}
        />
      </div>

      {previewOut && (
        <button
          type="button"
          onClick={() =>
            previewAnchor.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
          className="fixed bottom-5 right-5 z-20 min-h-12 rounded-full bg-ink px-5 text-sm font-semibold text-paper shadow-lg lg:hidden"
        >
          Preview ↑
        </button>
      )}
    </div>
  );
}
