const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 12 * 1024 * 1024;
const OUTPUT = 480;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () =>
      reject(new Error("ছবিটি পড়া গেল না। অন্য একটি ছবি চেষ্টা করো।"));
    img.src = src;
  });
}

/** Validates, center-crops to a square and shrinks the photo. Stays in the browser. */
export async function processPhoto(file: File): Promise<string> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("শুধু JPG, PNG বা WebP ছবি দেওয়া যাবে।");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("ছবিটি অনেক বড় (সর্বোচ্চ ১২ MB)। একটু ছোট ছবি বেছে নাও।");
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    if (!side) throw new Error("ছবিটি পড়া গেল না। অন্য একটি ছবি চেষ্টা করো।");

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("তোমার ব্রাউজারে ছবি প্রসেস করা যাচ্ছে না।");

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUTPUT, OUTPUT);
    ctx.drawImage(
      img,
      (img.naturalWidth - side) / 2,
      (img.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      OUTPUT,
      OUTPUT,
    );
    return canvas.toDataURL("image/jpeg", 0.9);
  } finally {
    URL.revokeObjectURL(url);
  }
}
