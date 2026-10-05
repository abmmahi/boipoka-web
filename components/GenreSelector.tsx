"use client";

import { useState } from "react";
import Section, { CheckMark } from "./Section";
import { genres, MAX_GENRES } from "@/data/genres";
import { toBengaliDigits } from "@/lib/utils";

export default function GenreSelector({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [msg, setMsg] = useState<string | null>(null);
  const full = selected.length >= MAX_GENRES;

  function toggle(id: string) {
    setMsg(null);
    if (selected.includes(id)) onChange(selected.filter((x) => x !== id));
    else if (!full) onChange([...selected, id]);
    else setMsg(`সর্বোচ্চ ${toBengaliDigits(MAX_GENRES)}টি বেছে নেওয়া যায়।`);
  }

  return (
    <Section
      title="কোন গল্পে তুমি হারিয়ে যেতে ভালোবাসো?"
      hint="সর্বোচ্চ ৫টি।"
      aside={
        <span
          className="shrink-0 rounded-full bg-ink px-3 py-1 text-sm font-medium text-paper"
          aria-live="polite"
        >
          {selected.length} / {MAX_GENRES} নির্বাচিত
        </span>
      }
    >
      <ul className="flex flex-wrap gap-2">
        {genres.map((g) => {
          const on = selected.includes(g.id);
          const disabled = full && !on;
          return (
            <li key={g.id}>
              <button
                type="button"
                aria-pressed={on}
                aria-disabled={disabled}
                onClick={() => toggle(g.id)}
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 px-4 text-base transition ${
                  on
                    ? "border-wood bg-wood font-medium text-white"
                    : disabled
                      ? "border-line bg-white/50 opacity-50"
                      : "border-line bg-white hover:border-wood"
                }`}
              >
                {on && <CheckMark />}
                {g.bn}
                <span className="sr-only"> ({g.name})</span>
              </button>
            </li>
          );
        })}
      </ul>
      {msg && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {msg}
        </p>
      )}
    </Section>
  );
}
