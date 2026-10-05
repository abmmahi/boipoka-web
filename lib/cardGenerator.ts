import { getFontEmbedCSS, toBlob, toJpeg } from "html-to-image";

export const CARD_SIZE = 1080;
export type ExportFormat = "png" | "jpg";

let fontCssCache: string | null = null;

async function waitForFonts() {
  if (typeof document === "undefined" || !("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load('400 24px "Hind Siliguri"', "আবক Ab"),
      document.fonts.load('500 24px "Hind Siliguri"', "আবক Ab"),
      document.fonts.load('600 24px "Hind Siliguri"', "আবক Ab"),
      document.fonts.load('600 40px "Noto Serif Bengali"', "আবক"),
      document.fonts.load('700 40px "Playfair Display"', "ABM 127"),
      document.fonts.load('400 24px "Playfair Display"', "BOIPOKA"),
    ]);
    await document.fonts.ready;
  } catch {
    /* fonts are best-effort; export still continues */
  }
}

/**
 * Renders the card node to a 1080x1080 image, entirely in the browser.
 * The node must be the card itself (fixed 1080x1080, no transform on it).
 */
export async function renderCard(
  node: HTMLElement,
  format: ExportFormat,
): Promise<Blob> {
  await waitForFonts();

  if (!fontCssCache) {
    fontCssCache = await getFontEmbedCSS(node);
  }

  const options = {
    width: CARD_SIZE,
    height: CARD_SIZE,
    pixelRatio: 1, // exactly 1080x1080, even on retina screens
    fontEmbedCSS: fontCssCache,
    backgroundColor: "#1a1008",
  };

  // First pass "warms up" fonts and images (fixes blank results on some
  // Safari/mobile browsers). The second pass is the real export.
  await toBlob(node, options);

  if (format === "png") {
    const blob = await toBlob(node, options);
    if (!blob) throw new Error("export-failed");
    return blob;
  }

  const dataUrl = await toJpeg(node, { ...options, quality: 0.95 });
  const res = await fetch(dataUrl);
  return await res.blob();
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
