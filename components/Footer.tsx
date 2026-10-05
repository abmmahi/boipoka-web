export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-1 px-5 py-8 text-center text-sm text-ink-soft sm:px-8">
        <p>বইপোকা · তোমার বইপড়ার পরিচয়</p>
        <p>
          Developed by{" "}
          <a
            href="https://abmmahi.github.io"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ink underline underline-offset-4 transition hover:text-wood"
          >
            ABM MAHI
          </a>
        </p>
      </div>
    </footer>
  );
}
