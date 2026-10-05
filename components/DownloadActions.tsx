"use client";

import type { ExportFormat } from "@/lib/cardGenerator";

export interface Notice {
  kind: "ok" | "error";
  text: string;
}

export default function DownloadActions({
  busy,
  notice,
  onShare,
  onDownload,
  onCopyCaption,
}: {
  busy: boolean;
  notice: Notice | null;
  onShare: () => void;
  onDownload: (f: ExportFormat) => void;
  onCopyCaption: () => void;
}) {
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onShare}
        disabled={busy}
        className="min-h-13 w-full rounded-2xl bg-ink px-5 py-3 text-lg font-semibold text-paper transition hover:bg-black disabled:opacity-60"
      >
        {busy ? "কার্ড তৈরি হচ্ছে…" : "✨ আমার Reading Identity শেয়ার করি"}
      </button>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onDownload("png")}
          disabled={busy}
          className="min-h-11 rounded-xl border border-ink bg-white px-3 text-sm font-medium transition hover:bg-[#f3e6d0] disabled:opacity-60"
        >
          ↓ Download PNG
        </button>
        <button
          type="button"
          onClick={() => onDownload("jpg")}
          disabled={busy}
          className="min-h-11 rounded-xl border border-line bg-white px-3 text-sm font-medium transition hover:border-ink disabled:opacity-60"
        >
          ↓ Download JPG
        </button>
      </div>
      <button
        type="button"
        onClick={onCopyCaption}
        className="mt-2 min-h-11 w-full rounded-xl px-3 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
      >
        ক্যাপশন কপি করো
      </button>
      <div aria-live="polite" className="min-h-6 text-center text-sm">
        {notice && (
          <p
            role={notice.kind === "error" ? "alert" : undefined}
            className={notice.kind === "error" ? "font-medium text-red-700" : "text-ink-soft"}
          >
            {notice.text}
          </p>
        )}
      </div>
    </div>
  );
}
