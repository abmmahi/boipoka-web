export interface ReadingTitle {
  min: number; // inclusive lower bound of book count
  bn: string;
  en: string;
}

// Ordered from lowest to highest. Easy to edit or extend.
export const readingTitles: ReadingTitle[] = [
  { min: 0, bn: "নতুন পাঠক", en: "The New Reader" },
  { min: 6, bn: "কৌতূহলী পাঠক", en: "The Curious Reader" },
  { min: 21, bn: "বইপোকা", en: "The Bookworm" },
  { min: 51, bn: "নিবেদিত পাঠক", en: "The Devoted Reader" },
  { min: 101, bn: "অভিজ্ঞ পাঠক", en: "The Seasoned Reader" },
  { min: 251, bn: "সাহিত্যপ্রেমী", en: "The Literature Lover" },
  { min: 500, bn: "কিংবদন্তি পাঠক", en: "The Legendary Reader" },
];

export function getReadingTitle(count: number): ReadingTitle {
  let result = readingTitles[0];
  for (const t of readingTitles) {
    if (count >= t.min) result = t;
  }
  return result;
}
