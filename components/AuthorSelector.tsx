"use client";

import { useEffect, useMemo, useState } from "react";
import Section, { CheckMark } from "./Section";
import {
  authors,
  MAX_AUTHORS,
  toSelected,
  type AuthorCategory,
  type SelectedAuthor,
} from "@/data/authors";
import { getInitials, toBengaliDigits } from "@/lib/utils";
import {
  authorKey,
  cleanAuthorName,
  findBuiltIn,
  validateAuthorName,
  type CommunityAuthor,
} from "@/lib/authorKeys";

type Tab = "all" | AuthorCategory;
const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "সব" },
  { id: "bangla", label: "বাংলা" },
  { id: "international", label: "আন্তর্জাতিক" },
];
const CATEGORY_LABEL: Record<AuthorCategory, string> = {
  bangla: "বাংলা",
  international: "আন্তর্জাতিক",
};

const PAGE = 8;
const MINE_KEY = "boipoka:mine";

interface Item {
  id: string;
  title: string;
  sub: string;
  category: AuthorCategory;
  selected: SelectedAuthor;
  communityKey?: string;
}

function readMine(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(MINE_KEY) ?? "{}");
  } catch {
    return {};
  }
}
function writeMine(v: Record<string, string>) {
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify(v));
  } catch {
    /* storage may be blocked; undo just won't be available */
  }
}

export default function AuthorSelector({
  selected,
  onChange,
}: {
  selected: SelectedAuthor[];
  onChange: (list: SelectedAuthor[]) => void;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [visible, setVisible] = useState(PAGE);
  const [community, setCommunity] = useState<CommunityAuthor[]>([]);
  const [mine, setMine] = useState<Record<string, string>>({});
  const [typed, setTyped] = useState("");
  const [pending, setPending] = useState<string | null>(null); // name waiting for a category
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  // Load the shared list once
  useEffect(() => {
    setMine(readMine());
    let cancelled = false;
    fetch("/api/authors")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d.authors)) setCommunity(d.authors);
      })
      .catch(() => {
        /* offline or no database: built-in list still works */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const full = selected.length >= MAX_AUTHORS;
  const isOn = (id: string) => selected.some((s) => s.id === id);
  const limitText = `সর্বোচ্চ ${toBengaliDigits(MAX_AUTHORS)} জন বেছে নেওয়া যায়।`;

  const items: Item[] = useMemo(() => {
    const built: Item[] = authors.map((a) => ({
      id: a.id,
      title: a.bn,
      sub: a.name,
      category: a.category,
      selected: toSelected(a),
    }));
    const shared: Item[] = community.map((c) => ({
      id: `c:${c.key}`,
      title: c.name,
      sub: `${CATEGORY_LABEL[c.category]} · পাঠকদের যোগ করা`,
      category: c.category,
      selected: { id: `c:${c.key}`, label: c.name, short: c.name, custom: true },
      communityKey: c.key,
    }));
    return [...built, ...shared];
  }, [community]);

  const filtered = items.filter((i) => tab === "all" || i.category === tab);
  const shown = filtered.slice(0, visible);
  const remaining = filtered.length - shown.length;

  function select(item: SelectedAuthor): boolean {
    if (isOn(item.id)) return true;
    if (full) {
      setMsg({ kind: "error", text: limitText });
      return false;
    }
    onChange([...selected, item]);
    return true;
  }

  function toggle(item: Item) {
    setMsg(null);
    if (isOn(item.id)) onChange(selected.filter((s) => s.id !== item.id));
    else select(item.selected);
  }

  function removeSelected(id: string) {
    setMsg(null);
    onChange(selected.filter((s) => s.id !== id));
  }

  function startAdd() {
    setMsg(null);
    const name = cleanAuthorName(typed);
    const problem = validateAuthorName(name);
    if (problem) {
      setMsg({ kind: "error", text: problem });
      return;
    }
    // already known? just pick the existing one
    const built = findBuiltIn(name);
    const shared = community.find((c) => c.key === authorKey(name));
    const existing = built
      ? toSelected(built)
      : shared
        ? { id: `c:${shared.key}`, label: shared.name, short: shared.name, custom: true }
        : null;
    if (existing) {
      if (select(existing)) {
        setMsg({ kind: "ok", text: "এই লেখক তালিকাতেই আছে। তোমার কার্ডে যোগ করে দিলাম।" });
        setTyped("");
      }
      return;
    }
    setPending(name);
  }

  async function addWithCategory(category: AuthorCategory) {
    if (!pending) return;
    const name = pending;
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, category }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.author) {
        const a: CommunityAuthor = data.author;
        setCommunity((prev) =>
          prev.some((p) => p.key === a.key) ? prev : [a, ...prev],
        );
        if (data.token) {
          const next = { ...mine, [a.key]: data.token as string };
          setMine(next);
          writeMine(next);
        }
        const picked = select({ id: `c:${a.key}`, label: a.name, short: a.name, custom: true });
        setMsg({
          kind: picked ? "ok" : "error",
          text: picked
            ? "নামটা তালিকায় যোগ হয়েছে, এখন সব পাঠক এটা দেখতে পাবে।"
            : `নামটা তালিকায় যোগ হয়েছে, কিন্তু তোমার কার্ডে ${toBengaliDigits(MAX_AUTHORS)} জন পূর্ণ। আগে একজনকে সরাও।`,
        });
        setTyped("");
        setPending(null);
        setTab(category);
        setVisible(PAGE);
      } else if (res.status === 503) {
        // no shared database connected: still let this person use the name
        const local: SelectedAuthor = {
          id: `custom:${authorKey(name)}`,
          label: name,
          short: name,
          custom: true,
        };
        if (select(local)) {
          setMsg({
            kind: "ok",
            text: "নামটা তোমার কার্ডে যোগ হয়েছে। (সবার জন্য তালিকায় এখন সংরক্ষণ করা যাচ্ছে না।)",
          });
          setTyped("");
        }
        setPending(null);
      } else {
        setMsg({
          kind: "error",
          text: data.error ?? "এই মুহূর্তে নামটা যোগ করা গেল না।",
        });
        setPending(null);
      }
    } catch {
      setMsg({ kind: "error", text: "ইন্টারনেট সংযোগ চেক করে আবার চেষ্টা করো।" });
      setPending(null);
    } finally {
      setSaving(false);
    }
  }

  async function deleteMine(item: Item) {
    const key = item.communityKey;
    if (!key || !mine[key]) return;
    if (!window.confirm(`"${item.title}" নামটা সবার তালিকা থেকে মুছে ফেলবে?`)) return;
    try {
      const res = await fetch("/api/authors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, token: mine[key] }),
      });
      if (!res.ok) throw new Error();
      setCommunity((prev) => prev.filter((c) => c.key !== key));
      onChange(selected.filter((s) => s.id !== item.id));
      const next = { ...mine };
      delete next[key];
      setMine(next);
      writeMine(next);
      setMsg({ kind: "ok", text: "নামটা তালিকা থেকে মুছে ফেলা হয়েছে।" });
    } catch {
      setMsg({ kind: "error", text: "নামটা মুছতে পারলাম না।" });
    }
  }

  return (
    <Section
      title="কার লেখা তোমার সবচেয়ে ভালো লাগে?"
      hint="সর্বোচ্চ ৫ জন। এরাই তোমার Literary DNA।"
      aside={
        <span
          className="shrink-0 rounded-full bg-ink px-3 py-1 text-sm font-medium text-paper"
          aria-live="polite"
        >
          {selected.length} / {MAX_AUTHORS} নির্বাচিত
        </span>
      }
    >
      {selected.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2" aria-label="তোমার বাছাই করা লেখক">
          {selected.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-1 rounded-full bg-wood py-1 pl-3 pr-1 text-sm font-medium text-white"
            >
              {s.label}
              <button
                type="button"
                onClick={() => removeSelected(s.id)}
                aria-label={`${s.label} সরাও`}
                className="flex size-8 items-center justify-center rounded-full text-base hover:bg-white/20"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mb-3 flex gap-2" role="group" aria-label="লেখকের ধরন">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setVisible(PAGE);
            }}
            className={`min-h-10 rounded-full border px-4 text-sm transition ${
              tab === t.id
                ? "border-ink bg-ink text-paper"
                : "border-line bg-white hover:border-wood"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {shown.map((item) => {
          const on = isOn(item.id);
          const canDelete = !!item.communityKey && !!mine[item.communityKey];
          return (
            <li key={item.id}>
              <AuthorButton
                on={on}
                disabled={full && !on}
                title={item.title}
                sub={item.sub}
                badge={getInitials(item.title).slice(0, 2)}
                onClick={() => toggle(item)}
              />
              {canDelete && (
                <button
                  type="button"
                  onClick={() => deleteMine(item)}
                  className="mt-1 px-2 text-xs text-ink-soft underline underline-offset-4 hover:text-red-700"
                >
                  আমার যোগ করা নাম, তালিকা থেকে মুছো
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + PAGE)}
          className="mt-3 min-h-11 w-full rounded-xl border border-line bg-white text-sm font-medium transition hover:border-wood"
        >
          আরও দেখো ({toBengaliDigits(remaining)}টি)
        </button>
      )}
      {visible > PAGE && remaining <= 0 && (
        <button
          type="button"
          onClick={() => setVisible(PAGE)}
          className="mt-3 min-h-11 w-full rounded-xl px-3 text-sm text-ink-soft underline underline-offset-4"
        >
          কম দেখাও
        </button>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <div className="flex gap-2">
          <label htmlFor="custom-author" className="sr-only">
            নিজের পছন্দের লেখক যোগ করো
          </label>
          <input
            id="custom-author"
            type="text"
            value={typed}
            maxLength={40}
            placeholder="তালিকায় নেই? নিজে লেখো"
            disabled={saving}
            onChange={(e) => {
              setTyped(e.target.value);
              setPending(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                startAdd();
              }
            }}
            className="min-h-11 min-w-0 flex-1 rounded-xl border border-line bg-white px-3 outline-none focus:border-wood"
          />
          <button
            type="button"
            onClick={startAdd}
            disabled={saving}
            className="min-h-11 rounded-xl border border-ink bg-ink px-4 text-sm font-medium text-paper disabled:opacity-60"
          >
            যোগ করো
          </button>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          তুমি যে নাম যোগ করবে, সেটা সব পাঠক তালিকায় দেখতে পাবে।
        </p>

        {pending && (
          <div
            role="group"
            aria-label="লেখকের ধরন বেছে নাও"
            className="mt-3 rounded-xl border border-line bg-[#f3e6d0] p-3"
          >
            <p className="text-sm font-medium">
              “{pending}” কোন ধরনের লেখক?
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => addWithCategory("bangla")}
                className="min-h-11 rounded-xl border-2 border-wood bg-white px-4 text-sm font-medium hover:bg-wood hover:text-white disabled:opacity-60"
              >
                বাংলা
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => addWithCategory("international")}
                className="min-h-11 rounded-xl border-2 border-wood bg-white px-4 text-sm font-medium hover:bg-wood hover:text-white disabled:opacity-60"
              >
                আন্তর্জাতিক
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => setPending(null)}
                className="min-h-11 rounded-xl px-3 text-sm text-ink-soft underline underline-offset-4"
              >
                বাতিল
              </button>
            </div>
            {saving && <p className="mt-2 text-xs text-ink-soft">যোগ হচ্ছে…</p>}
          </div>
        )}

        <div aria-live="polite">
          {msg && (
            <p
              role={msg.kind === "error" ? "alert" : undefined}
              className={`mt-2 text-sm ${
                msg.kind === "error" ? "font-medium text-red-700" : "text-ink-soft"
              }`}
            >
              {msg.text}
            </p>
          )}
        </div>
      </div>
    </Section>
  );
}

function AuthorButton({
  on,
  disabled,
  title,
  sub,
  badge,
  onClick,
}: {
  on: boolean;
  disabled: boolean;
  title: string;
  sub: string;
  badge: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-disabled={disabled}
      onClick={onClick}
      className={`flex min-h-14 w-full items-center gap-3 rounded-xl border-2 px-3 py-2 text-left transition ${
        on
          ? "border-wood bg-[#f3e6d0]"
          : disabled
            ? "border-line bg-white/50 opacity-50"
            : "border-line bg-white hover:border-wood"
      }`}
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-full font-bn-serif text-base font-semibold ${
          on ? "bg-wood text-white" : "bg-[#efe6d6] text-wood"
        }`}
        aria-hidden="true"
      >
        {on ? <CheckMark /> : badge}
      </span>
      <span className="min-w-0">
        <span className="block truncate font-medium leading-snug">{title}</span>
        <span className="block truncate text-xs text-ink-soft">{sub}</span>
      </span>
    </button>
  );
}
