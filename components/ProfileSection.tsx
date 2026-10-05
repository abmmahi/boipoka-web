"use client";

import { useRef, useState } from "react";
import Section from "./Section";
import { processPhoto } from "@/lib/image";
import { cleanName } from "@/lib/utils";

export default function ProfileSection({
  name,
  photo,
  onName,
  onPhoto,
}: {
  name: string;
  photo: string | null;
  onName: (v: string) => void;
  onPhoto: (v: string | null) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      onPhoto(await processPhoto(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "ছবিটি যোগ করা গেল না।");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <Section title="তোমার নাম কী?" hint="নামটাই কার্ডের মূল পরিচয়।">
      <label htmlFor="reader-name" className="sr-only">
        তোমার নাম
      </label>
      <input
        id="reader-name"
        type="text"
        value={name}
        maxLength={28}
        autoComplete="off"
        placeholder="যেমন: এ. বি. এম মাহী"
        onChange={(e) => onName(cleanName(e.target.value))}
        className="min-h-12 w-full rounded-xl border border-line bg-white px-4 text-lg outline-none transition focus:border-wood"
      />
      <div className="mt-1 text-right text-xs text-ink-soft">
        {Array.from(name).length} / 28
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={fileRef}
          id="reader-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <label
          htmlFor="reader-photo"
          className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-line bg-white px-4 text-sm font-medium transition hover:border-wood focus-within:outline-2"
        >
          {busy ? "ছবি প্রস্তুত হচ্ছে…" : photo ? "ছবি বদলাও" : "ছবি যোগ করো (ঐচ্ছিক)"}
        </label>
        {photo && (
          <button
            type="button"
            onClick={() => onPhoto(null)}
            className="min-h-11 rounded-xl px-3 text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
          >
            ছবি সরাও
          </button>
        )}
      </div>
      <p className="mt-2 text-xs text-ink-soft">JPG, PNG বা WebP। ছবি তোমার ফোন/কম্পিউটারেই থাকে।</p>
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </Section>
  );
}
