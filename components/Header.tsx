export default function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 pt-6 sm:px-8">
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#7a4d2a"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
        <path d="M20 19v2H6.5" />
      </svg>
      <div className="leading-tight">
        <div className="font-bn-serif text-xl font-semibold">বইপোকা</div>
        <div className="font-display text-xs tracking-[0.3em] text-ink-soft">
          BOIPOKA
        </div>
      </div>
    </header>
  );
}
