"use client";

import Section, { CheckMark } from "./Section";
import { themes, type Theme, type ThemeId } from "@/data/themes";

function Mini({ theme }: { theme: Theme }) {
  return (
    <span
      aria-hidden="true"
      className="relative block aspect-square w-full overflow-hidden rounded-lg"
      style={{ background: theme.cardBg }}
    >
      <span
        className="absolute inset-[8%] rounded-md"
        style={{ border: `1px solid ${theme.line}` }}
      />
      <span
        className="absolute left-1/2 top-[12%] block size-[16%] -translate-x-1/2 rounded-full"
        style={{ border: `1.5px solid ${theme.accent}`, background: theme.avatarBg }}
      />
      <span
        className="absolute left-[24%] right-[24%] top-[34%] block h-[4%] rounded-full"
        style={{ background: theme.ink, opacity: 0.85 }}
      />
      <span
        className="absolute bottom-[14%] left-[22%] right-[22%] flex h-[34%] items-end gap-[2px] rounded-sm px-[3px]"
        style={{ background: theme.panelBg, border: `2px solid ${theme.caseFrame}` }}
      >
        {[70, 90, 60, 82, 74, 95, 66, 85].map((h, i) => (
          <span
            key={i}
            className="block flex-1 rounded-t-[1px]"
            style={{ height: `${h}%`, background: theme.spines[i % theme.spines.length] }}
          />
        ))}
      </span>
    </span>
  );
}

export default function ThemeSelector({
  value,
  onChange,
  onSurprise,
}: {
  value: ThemeId;
  onChange: (id: ThemeId) => void;
  onSurprise: () => void;
}) {
  return (
    <Section
      title="তোমার কার্ডের মেজাজ বেছে নাও"
      aside={
        <button
          type="button"
          onClick={onSurprise}
          className="min-h-10 shrink-0 rounded-full border border-line bg-white px-4 text-sm font-medium transition hover:border-wood"
        >
          🎲 Surprise Me
        </button>
      }
    >
      <div
        role="radiogroup"
        aria-label="কার্ড থিম"
        className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      >
        {themes.map((t) => {
          const on = t.id === value;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(t.id)}
              className={`rounded-xl border-2 p-2 text-left transition ${
                on ? "border-wood bg-[#f3e6d0]" : "border-line bg-white hover:border-wood"
              }`}
            >
              <Mini theme={t} />
              <span className="mt-2 flex items-center justify-between gap-1 px-1">
                <span className="text-sm font-medium leading-snug">{t.bn}</span>
                {on && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-wood text-white">
                    <CheckMark />
                  </span>
                )}
              </span>
              <span className="block px-1 pb-1 text-xs leading-snug text-ink-soft">
                {t.name}
              </span>
            </button>
          );
        })}
      </div>
    </Section>
  );
}
