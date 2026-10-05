export interface Genre {
  id: string;
  name: string; // English
  bn: string; // Bengali label shown on the card
}

export const MAX_GENRES = 5;

export const genres: Genre[] = [
  { id: "thriller", name: "Thriller", bn: "থ্রিলার" },
  { id: "mystery", name: "Mystery", bn: "রহস্য" },
  { id: "fiction", name: "Fiction", bn: "ফিকশন" },
  { id: "sci-fi", name: "Science Fiction", bn: "সায়েন্স ফিকশন" },
  { id: "fantasy", name: "Fantasy", bn: "ফ্যান্টাসি" },
  { id: "romance", name: "Romance", bn: "রোমান্স" },
  { id: "poetry", name: "Poetry", bn: "কবিতা" },
  { id: "novel", name: "Novel", bn: "উপন্যাস" },
  { id: "history", name: "History", bn: "ইতিহাস" },
  { id: "philosophy", name: "Philosophy", bn: "দর্শন" },
  { id: "self-help", name: "Self-help", bn: "সেলফ-হেল্প" },
  { id: "biography", name: "Biography", bn: "জীবনী" },
  { id: "psychology", name: "Psychology", bn: "মনোবিজ্ঞান" },
  { id: "horror", name: "Horror", bn: "ভৌতিক" },
  { id: "adventure", name: "Adventure", bn: "অ্যাডভেঞ্চার" },
  { id: "classics", name: "Classics", bn: "ক্লাসিক" },
  { id: "literature", name: "Literature", bn: "সাহিত্য" },
  { id: "islamic", name: "Islamic Literature", bn: "ইসলামি সাহিত্য" },
  { id: "children", name: "Children's Literature", bn: "শিশুসাহিত্য" },
];

export function getGenre(id: string): Genre | undefined {
  return genres.find((g) => g.id === id);
}
