# বইপোকা (Boipoka) — Phase 1

তোমার বইপড়ার পরিচয়।

## চালানোর নিয়ম (নিজের কম্পিউটারে)
1. Node.js 20+ লাগবে (`node -v` দিয়ে দেখো)
2. এই ফোল্ডারে টার্মিনাল খুলে:
   npm install
   npm run dev
3. ব্রাউজারে http://localhost:3000 খোলো

## Vercel-এ publish
1. ফোল্ডারটা GitHub repo-তে push করো
2. vercel.com → Add New → Project → repo বেছে নাও → Deploy (কোনো settings বদলাতে হবে না)

## ফাইল কোথায় কী
- data/      লেখক, জনরা, থিম, রিডিং টাইটেল (এখানেই নতুন কিছু যোগ করো)
- lib/       bookshelfEngine, cardGenerator (ছবি export), shareUtils
- components/ UI অংশগুলো (ReadingCard = মূল কার্ড)
- app/       পেজ, layout, global style

## সবার জন্য লেখকের তালিকা (Upstash Redis)
ব্যবহারকারীর যোগ করা লেখকের নাম সবার জন্য সংরক্ষণ করতে একটা ছোট database লাগে।
1. Vercel → তোমার project → Storage (বা Marketplace) → Upstash Redis → Create/Connect
2. Free plan বেছে নাও, project-এর সাথে connect করো (environment variable নিজে থেকেই যোগ হয়)
3. Redeploy করো
Database না থাকলে অ্যাপ ঠিকই চলে, শুধু নতুন নাম নিজের কার্ডে যোগ হয়, সবার তালিকায় না।

কোনো খারাপ/ভুল নাম মুছতে: Upstash console → Data Browser → key `boipoka:authors` → ওই field মুছে দাও।
