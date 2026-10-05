export type AuthorCategory = "bangla" | "international";

export interface Author {
  id: string;
  name: string; // English
  bn: string; // full Bengali name
  short: string; // short form used on the card
  category: AuthorCategory;
}

// What the user has picked (built-in or custom-typed authors)
export interface SelectedAuthor {
  id: string;
  label: string; // full label for the editor
  short: string; // short label for the card
  custom?: boolean;
}

export const MAX_AUTHORS = 5;

export const authors: Author[] = [
  { id: "humayun-ahmed", name: "Humayun Ahmed", bn: "হুমায়ূন আহমেদ", short: "হুমায়ূন", category: "bangla" },
  { id: "tagore", name: "Rabindranath Tagore", bn: "রবীন্দ্রনাথ ঠাকুর", short: "রবীন্দ্রনাথ", category: "bangla" },
  { id: "nazrul", name: "Kazi Nazrul Islam", bn: "কাজী নজরুল ইসলাম", short: "নজরুল", category: "bangla" },
  { id: "sarat", name: "Sarat Chandra Chattopadhyay", bn: "শরৎচন্দ্র চট্টোপাধ্যায়", short: "শরৎচন্দ্র", category: "bangla" },
  { id: "rokib-hasan", name: "Rokib Hasan", bn: "রকিব হাসান", short: "রকিব হাসান", category: "bangla" },
  { id: "jibanananda", name: "Jibanananda Das", bn: "জীবনানন্দ দাশ", short: "জীবনানন্দ", category: "bangla" },
  { id: "elias", name: "Akhtaruzzaman Elias", bn: "আখতারুজ্জামান ইলিয়াস", short: "ইলিয়াস", category: "bangla" },
  { id: "mujtaba", name: "Syed Mujtaba Ali", bn: "সৈয়দ মুজতবা আলী", short: "মুজতবা আলী", category: "bangla" },
  { id: "zafar-iqbal", name: "Muhammed Zafar Iqbal", bn: "মুহম্মদ জাফর ইকবাল", short: "জাফর ইকবাল", category: "bangla" },
  { id: "rokeya", name: "Begum Rokeya", bn: "বেগম রোকেয়া", short: "রোকেয়া", category: "bangla" },
  { id: "selina", name: "Selina Hossain", bn: "সেলিনা হোসেন", short: "সেলিনা হোসেন", category: "bangla" },
  { id: "manik", name: "Manik Bandopadhyay", bn: "মানিক বন্দ্যোপাধ্যায়", short: "মানিক", category: "bangla" },
  { id: "bibhutibhushan", name: "Bibhutibhushan Bandyopadhyay", bn: "বিভূতিভূষণ বন্দ্যোপাধ্যায়", short: "বিভূতিভূষণ", category: "bangla" },
  { id: "satyajit", name: "Satyajit Ray", bn: "সত্যজিৎ রায়", short: "সত্যজিৎ", category: "bangla" },
  { id: "sunil", name: "Sunil Gangopadhyay", bn: "সুনীল গঙ্গোপাধ্যায়", short: "সুনীল", category: "bangla" },
  { id: "shirshendu", name: "Shirshendu Mukhopadhyay", bn: "শীর্ষেন্দু মুখোপাধ্যায়", short: "শীর্ষেন্দু", category: "bangla" },
  { id: "dan-brown", name: "Dan Brown", bn: "ড্যান ব্রাউন", short: "ড্যান ব্রাউন", category: "international" },
  { id: "rowling", name: "J.K. Rowling", bn: "জে. কে. রাউলিং", short: "রাউলিং", category: "international" },
  { id: "orwell", name: "George Orwell", bn: "জর্জ অরওয়েল", short: "অরওয়েল", category: "international" },
  { id: "coelho", name: "Paulo Coelho", bn: "পাওলো কোয়েলহো", short: "কোয়েলহো", category: "international" },
  { id: "christie", name: "Agatha Christie", bn: "আগাথা ক্রিস্টি", short: "আগাথা ক্রিস্টি", category: "international" },
  { id: "doyle", name: "Arthur Conan Doyle", bn: "আর্থার কোনান ডয়েল", short: "কোনান ডয়েল", category: "international" },
  { id: "tolstoy", name: "Leo Tolstoy", bn: "লিও টলস্টয়", short: "টলস্টয়", category: "international" },
  { id: "dostoevsky", name: "Fyodor Dostoevsky", bn: "ফিওদর দস্তয়েভস্কি", short: "দস্তয়েভস্কি", category: "international" },
];

export function toSelected(a: Author): SelectedAuthor {
  return { id: a.id, label: a.bn, short: a.short };
}

export function getAuthor(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}
