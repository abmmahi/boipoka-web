"use client";

import { useEffect, useState } from "react";
import Section from "./Section";
import { clamp } from "@/lib/utils";
import { getReadingTitle } from "@/data/readingTitles";

const QUICK = [10, 25, 50, 100, 250, 500];

export default function BookCountSelector({
  count,
  onChange,
}: {
  count: number;
  onChange: (n: number) => void;
}) {
  const [raw, setRaw] = useState(String(count));

  useEffect(() => {
    if (parseInt(raw || "0", 10) !== count) setRaw(String(count));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  function handleInput(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 5);
    setRaw(digits);
    onChange(clamp(parseInt(digits || "0", 10), 0, 99999));
  }

  const title = getReadingTitle(count);

  return (
    <Section
      title="তুমি কতদূর এগিয়েছো?"
      hint="আনুমানিক সংখ্যা দিলেই চলবে। তাকের বই সাথে সাথে বদলাবে।"
      aside={
        <span className="shrink-0 rounded-full border border-line px-3 py-1 text-sm font-medium">
          {title.bn}
        </span>
      }
    >
      <div className="flex flex-wrap gap-2" role="group" aria-label="দ্রুত বেছে নাও">
        {QUICK.map((q) => {
          const active = count === q;
          return (
            <button
              key={q}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(q)}
              className={`min-h-11 min-w-14 rounded-xl border px-4 text-base font-medium transition ${
                active
                  ? "border-wood bg-wood text-white"
                  : "border-line bg-white hover:border-wood"
              }`}
            >
              {q === 500 ? "500+" : q}
            </button>
          );
        })}
      </div>

      <label htmlFor="book-range" className="sr-only">
        বইয়ের সংখ্যা স্লাইডার
      </label>
      <input
        id="book-range"
        type="range"
        min={0}
        max={500}
        step={1}
        value={Math.min(count, 500)}
        onChange={(e) => handleInput(e.target.value)}
        className="mt-5 w-full accent-[#7a4d2a]"
      />

      <div className="mt-3 flex items-center gap-3">
        <label htmlFor="book-count" className="text-sm text-ink-soft">
          নিজে লেখো:
        </label>
        <input
          id="book-count"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={raw}
          onChange={(e) => handleInput(e.target.value)}
          className="min-h-11 w-28 rounded-xl border border-line bg-white px-3 text-lg outline-none focus:border-wood"
        />
        <span className="text-sm text-ink-soft">টি বই</span>
      </div>
    </Section>
  );
}
