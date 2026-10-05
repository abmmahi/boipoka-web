export default function Hero() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-6 pt-8 sm:px-8 sm:pt-12">
      <h1 className="font-bn-serif text-4xl font-semibold leading-snug sm:text-5xl">
        তুমি আসলে কেমন পাঠক?
      </h1>
      <p className="mt-2 max-w-xl text-lg text-ink-soft sm:text-xl">
        তোমার বইপড়ার পরিচয়টা তৈরি করি।
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href="#studio"
          className="inline-flex min-h-12 items-center rounded-2xl bg-ink px-6 text-base font-semibold text-paper transition hover:bg-black sm:hidden"
        >
          আমার Reading Identity তৈরি করি ↓
        </a>
        <p className="text-sm text-ink-soft">Free • No Login • Private</p>
      </div>
    </section>
  );
}
