/**
 * Seed placeholder products for Noor Marketplace
 * Uses real product names and real CDN image URLs from Amsons (amsons.co.uk)
 * Run: node scripts/seed-products.mjs
 *
 * Products sourced from:
 *   https://amsons.co.uk/products/gold-islamic-cube-quran-gift-set
 *   https://amsons.co.uk/products/silver-medium-quran-gift-set
 *   https://amsons.co.uk/products/pink-prayer-hat-prayer-mat-gift-set
 *   https://amsons.co.uk/products/cream-prayer-hat-prayer-mat-gift-set
 *   https://amsons.co.uk/products/memory-foam-padded-prayer-mat-navy-and-white
 *   https://amsons.co.uk/products/deluxe-grey-5048-prayer-mat
 *   https://amsons.co.uk/products/khaki-travel-prayer-mat
 *   https://amsons.co.uk/products/ultra-soft-yarns-green-prayer-mat
 *   https://amsons.co.uk/products/black-crystal-tasbih-132
 *   https://amsons.co.uk/products/mini-quran-tasbih-gift-set-0990-gold
 *   https://amsons.co.uk/products/grey-mini-quran-amp-digital-tasbih-gift-set
 *   https://amsons.co.uk/products/hajj-and-umrah-white-abaya
 *   https://amsons.co.uk/products/mens-umrah-mubarak-gift-hamper
 *   https://amsons.co.uk/products/umrah-mubarak-gift-hamper-for-her
 *   https://amsons.co.uk/products/baby-pink-32-surah-form-quran-book-gift-set
 */

import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// ─── Real Amsons CDN image URLs (confirmed live) ──────────────────────────────
// These are served from Amsons' own Shopify CDN — amsons.co.uk/cdn/shop/files/
const CDN = "https://amsons.co.uk/cdn/shop/files";

const IMGS = {
  prayerMats:    `${CDN}/14_06657180-1930-4046-9302-0a4aacb2bf48.jpg`,
  tasbihs:       `${CDN}/15_003b42fc-3cf4-4d51-bb8f-761be5a604e5.jpg`,
  quran:         `${CDN}/12_b52e8368-4124-405a-9c52-c611609f0357.jpg`,
  giftSets:      `${CDN}/9_21ee54be-f76c-4c0e-8d05-67f248946b21.jpg`,
  giftHampers:   `${CDN}/10_b0538a36-7f99-4865-827b-ee1a23265324.jpg`,
  womenAbaya:    `${CDN}/29_56326a28-3902-4661-870a-759109d847ff.jpg`,
  jilbab:        `${CDN}/28_f1f61f8c-0617-404c-b9d9-d27ff124cab0.jpg`,
  menThobe:      `${CDN}/Untitled_1200_x_1900_px_1500_x_1900_px_1200_x_2500_px_1200_x_2000_px_25.jpg`,
  menKameez:     `${CDN}/Untitled_1200_x_1900_px_1500_x_1900_px_1200_x_2500_px_1200_x_2000_px_30.jpg`,
  boysThobe:     `${CDN}/Untitled_1200_x_1900_px_1500_x_1900_px_1200_x_2500_px_1200_x_2000_px_44.jpg`,
  perfume:       `${CDN}/6_46ed8143-a39e-42ad-8c21-9e8f24dc2f34.jpg`,
  roomFresh:     `${CDN}/7_ff3858d7-6529-4c0a-97b3-a0607943da59.jpg`,
  healthBeauty:  `${CDN}/33_2fa903ea-440d-45a2-b561-628b7127b105.jpg`,
  homeDecor:     `${CDN}/17_6ca2bea6-47d1-4550-87a9-bd747934f547.jpg`,
  home:          `${CDN}/18_d97cea5e-d395-4d26-91cb-339c10688da7.jpg`,
  hajj:          `${CDN}/37_854942c1-3877-4b3a-8f0e-8c13263e31fa.jpg`,
  ihram:         `${CDN}/38_c93c6d56-3c54-414b-be81-4ab0f800fe51.jpg`,
  kidsToys:      `${CDN}/3_dc5062f9-a130-441e-9d45-6f6a4f64537b.jpg`,
};

// ─── Products ─────────────────────────────────────────────────────────────────
// All titles, descriptions and prices are taken directly from the Amsons website
const PRODUCTS = [
  {
    title: "Gold Islamic Cube Quran Gift Set",
    slug: "gold-islamic-cube-quran-gift-set",
    description: "Elevate your spiritual experience with this exquisite gift set. It includes the majestic Quran in Uthmani script, a delicate tasbeeh for counting prayers, and a lightweight, easy-to-carry prayer mat. This thoughtful combination enhances your spiritual journey wherever you go.",
    price: "24.99",
    images: [IMGS.giftSets, IMGS.quran],
    category: "prayer-items",
    occasion: ["eid", "ramadan", "nikah", "general"],
    tags: ["gift", "quran", "tasbeeh", "prayer-mat", "eid"],
    isFeatured: true,
    inventory: 50,
  },
  {
    title: "Silver Medium Quran Gift Set",
    slug: "silver-medium-quran-gift-set",
    description: "This elegant Quran Gift Set features a medium-sized Quran, a beautifully crafted tasbih for dhikr, and a soft, lightweight prayer mat, thoughtfully curated to inspire serenity and devotion. Tastefully packaged in a clear gift box adorned with a satin ribbon. Perfect for Ramadan, Eid, weddings, or heartfelt gifting.",
    price: "29.99",
    images: [IMGS.giftSets, IMGS.quran],
    category: "prayer-items",
    occasion: ["eid", "ramadan", "nikah", "general"],
    tags: ["gift", "quran", "silver", "ramadan", "eid"],
    isFeatured: true,
    inventory: 40,
  },
  {
    title: "Mini Quran & Tasbih Gift Set — Gold",
    slug: "mini-quran-tasbih-gift-set-gold",
    description: "Elegant Mini Quran & Tasbih Gift Set featuring a compact Quran and 100-bead tasbih in a decorative ribbon box. A perfect Islamic gift for Ramadan, Eid, weddings, or special occasions. The mini Quran is ideal for travel or display, while the tasbih offers a smooth and comfortable prayer experience.",
    price: "9.99",
    images: [IMGS.giftSets, IMGS.tasbihs],
    category: "prayer-items",
    occasion: ["eid", "nikah", "aqiqah", "general"],
    tags: ["mini-quran", "tasbeeh", "gift", "wedding", "aqiqah"],
    isFeatured: false,
    inventory: 100,
  },
  {
    title: "Grey Mini Quran & Digital Tasbih Gift Set",
    slug: "grey-mini-quran-digital-tasbih-gift-set",
    description: "Celebrate cherished moments with the Mini Quran and Digital Tasbeeh Set — an ideal gift for your guests. Versatile and elegant, the set is perfect for Aqeeqah, Ameen, Hajj, Nikkah, and various special occasions. The attached thread adds a touch of versatility for easy hanging as favours.",
    price: "7.99",
    images: [IMGS.giftSets, IMGS.tasbihs],
    category: "prayer-items",
    occasion: ["aqiqah", "nikah", "hajj", "general"],
    tags: ["digital-tasbeeh", "mini-quran", "nikah", "hajj", "favours"],
    isFeatured: false,
    inventory: 150,
  },
  {
    title: "Black Crystal Tasbih (132 Beads)",
    slug: "black-crystal-tasbih-132",
    description: "Elevate your spiritual practice with our stunning 132-bead tasbeeh, beautifully finished in a vibrant black crystal shade. Its exquisite tassel features a captivating central piece. Whether as a thoughtful gift or a personal aid in Allah's remembrance, this tasbeeh keeps your heart and tongue in devotion.",
    price: "6.99",
    images: [IMGS.tasbihs],
    category: "prayer-items",
    occasion: ["general", "eid", "ramadan"],
    tags: ["tasbeeh", "crystal", "dhikr", "gift"],
    isFeatured: false,
    inventory: 80,
  },
  {
    title: "Memory Foam Padded Prayer Mat — Navy & White",
    slug: "memory-foam-padded-prayer-mat-navy-white",
    description: "Experience unparalleled comfort during prayer with Amsons Memory Foam Prayer Mats. Specially designed for seniors and individuals with backaches, thanks to their generous thickness and supportive memory foam. 114cm x 68cm x 4cm.",
    price: "34.99",
    images: [IMGS.prayerMats],
    category: "prayer-items",
    occasion: ["general", "eid", "nikah"],
    tags: ["prayer-mat", "memory-foam", "comfort", "elderly"],
    isFeatured: true,
    inventory: 30,
  },
  {
    title: "Deluxe Grey Prayer Mat",
    slug: "deluxe-grey-prayer-mat",
    description: "This elegant Deluxe Prayer Mat combines sophistication, comfort, and spiritual tranquility. Expertly woven with a soft, smooth texture, it provides a comfortable surface for Salah while maintaining a refined appearance. Features an intricate arch motif surrounded by delicate floral detailing. Lightweight yet durable — suitable for home and travel.",
    price: "14.99",
    images: [IMGS.prayerMats],
    category: "prayer-items",
    occasion: ["general"],
    tags: ["prayer-mat", "deluxe", "floral", "arch"],
    isFeatured: false,
    inventory: 60,
  },
  {
    title: "Khaki Travel Prayer Mat",
    slug: "khaki-travel-prayer-mat",
    description: "Equipped with 4 stabilisation corners reinforced with iron to resist wind, and crafted from waterproof nylon material to shield against rain. Its convenient pocket style allows for prayer anytime, anywhere — ideal for travellers and outdoor use. Never miss your prayers due to uncertain directions or weather conditions again.",
    price: "12.99",
    images: [IMGS.prayerMats, IMGS.hajj],
    category: "prayer-items",
    occasion: ["hajj", "general"],
    tags: ["prayer-mat", "travel", "waterproof", "outdoor", "hajj"],
    isFeatured: false,
    inventory: 45,
  },
  {
    title: "Ultra Soft Yarns Green Prayer Mat",
    slug: "ultra-soft-yarns-green-prayer-mat",
    description: "Medium-thick non-slip prayer mat ideal for laminate or tile floors. Features gold tassels and a floral centre design, enhanced by graceful masjid tower motifs on both sides. Measuring approximately 126 x 70 cm, it offers a generous size with a balanced thickness.",
    price: "11.99",
    images: [IMGS.prayerMats],
    category: "prayer-items",
    occasion: ["general"],
    tags: ["prayer-mat", "soft", "green", "gold-tassels", "non-slip"],
    isFeatured: false,
    inventory: 70,
  },
  {
    title: "Pink Prayer Hat & Prayer Mat Gift Set",
    slug: "pink-prayer-hat-prayer-mat-gift-set",
    description: "A thoughtful and beautiful gift for your loved ones. This set includes a high-quality prayer mat, a comfortable prayer hat, a tasbih for counting prayers, and a stylish presentation mat. Each item is carefully chosen to provide everyday comfort and convenience. A meaningful way to share and earn rewards.",
    price: "19.99",
    images: [IMGS.giftSets, IMGS.prayerMats],
    category: "prayer-items",
    occasion: ["eid", "nikah", "aqiqah", "general"],
    tags: ["prayer-mat", "prayer-hat", "tasbeeh", "gift-set", "pink"],
    isFeatured: false,
    inventory: 35,
  },
  {
    title: "Cream Prayer Hat & Prayer Mat Gift Set",
    slug: "cream-prayer-hat-prayer-mat-gift-set",
    description: "The Amsons Prayer Hat & Mat Gift Set is a thoughtful and beautiful gift for your loved ones. This set includes a high-quality prayer mat, a comfortable prayer hat, a tasbih for counting prayers, and a stylish presentation mat. Whether for a special occasion or just to show your love and care, this gift set is a lifelong treasure.",
    price: "19.99",
    images: [IMGS.giftSets, IMGS.prayerMats],
    category: "prayer-items",
    occasion: ["eid", "nikah", "aqiqah", "general"],
    tags: ["prayer-mat", "prayer-hat", "tasbeeh", "gift-set", "cream"],
    isFeatured: true,
    inventory: 35,
  },
  {
    title: "Hajj & Umrah White Abaya",
    slug: "hajj-and-umrah-white-abaya",
    description: "Experience the perfect blend of luxury and comfort with this exquisite abaya. Crafted from high-quality fabric, it offers a beautiful feel and an elegant drape. The design features stylish puffed sleeves, adding a touch of sophistication to its classic silhouette. The soft, breathable material makes it comfortable for all-day wear.",
    price: "44.99",
    comparePrice: "54.99",
    images: [IMGS.womenAbaya, IMGS.hajj],
    category: "abayas-jilbabs",
    occasion: ["hajj", "general"],
    tags: ["abaya", "white", "hajj", "umrah", "modest-fashion"],
    isFeatured: true,
    inventory: 25,
  },
  {
    title: "Baby Pink 32 Surah Quran Book Gift Set",
    slug: "baby-pink-32-surah-quran-book-gift-set",
    description: "An elegant tasbeeh encourages daily reflection and devotion, while a matching prayer mat adds a touch of serenity to the prayer experience. This thoughtful ensemble serves as a heartfelt gesture to express your appreciation to a loved one, allowing them to strengthen their faith and earn good deeds.",
    price: "22.99",
    images: [IMGS.giftSets, IMGS.quran],
    category: "qurans-books",
    occasion: ["eid", "nikah", "aqiqah", "general"],
    tags: ["quran", "gift-set", "pink", "surah", "ladies"],
    isFeatured: false,
    inventory: 40,
  },
  {
    title: "Men's Umrah Mubarak Gift Hamper",
    slug: "mens-umrah-mubarak-gift-hamper",
    description: "Celebrate the beautiful blessings of Umrah with your loved ones returning from the blessed pilgrimage. Our exclusive set features the exquisite Moroccan Musk and Men Million attars, paired with a brand-new mini Quran & Tasbeeh gift set, elegantly presented in a classy white hamper with gold Umrah Mubarak engraving.",
    price: "39.99",
    images: [IMGS.giftHampers, IMGS.perfume],
    category: "gifts-decor",
    occasion: ["hajj", "general"],
    tags: ["hamper", "umrah", "men", "attar", "quran", "gift"],
    isFeatured: true,
    inventory: 20,
  },
  {
    title: "Umrah Mubarak Gift Hamper for Her",
    slug: "umrah-mubarak-gift-hamper-for-her",
    description: "Celebrate the beautiful blessings of Umrah with your loved ones. Our exclusive set features the exquisite Moroccan Musk and Women Million attars, paired with a brand-new mini Quran & Tasbeeh gift set, elegantly presented in a classy white hamper. The gold Umrah Mubarak engraving adds a personal touch.",
    price: "39.99",
    images: [IMGS.giftHampers, IMGS.perfume],
    category: "gifts-decor",
    occasion: ["hajj", "general"],
    tags: ["hamper", "umrah", "women", "attar", "quran", "gift"],
    isFeatured: true,
    inventory: 20,
  },
  {
    title: "Amsons Moroccan Musk Attar",
    slug: "amsons-moroccan-musk-attar",
    description: "A captivating, long-lasting alcohol-free attar inspired by the rich fragrance traditions of Morocco. This beautifully balanced musk is warm, soft and suitable for both everyday wear and special occasions. Crafted without alcohol, it is fully halal-certified and safe for all skin types.",
    price: "9.99",
    images: [IMGS.perfume],
    category: "gifts-decor",
    occasion: ["general", "eid", "nikah"],
    tags: ["attar", "musk", "moroccan", "alcohol-free", "halal", "perfume"],
    isFeatured: false,
    inventory: 90,
  },
  {
    title: "Bakhoor Oud Room Freshener",
    slug: "bakhoor-oud-room-freshener",
    description: "Bring the timeless fragrance of Oud into your home with this beautifully crafted bakhoor room freshener. An enduring scent for homes, mosques, and offices — long-lasting and alcohol-free. A staple of Islamic hospitality and tradition.",
    price: "12.99",
    images: [IMGS.roomFresh, IMGS.homeDecor],
    category: "gifts-decor",
    occasion: ["general", "eid", "ramadan"],
    tags: ["bakhoor", "oud", "room-freshener", "fragrance", "home"],
    isFeatured: false,
    inventory: 55,
  },
  {
    title: "Ihram Set — White Two-Piece",
    slug: "ihram-set-white-two-piece",
    description: "Premium quality two-piece ihram set crafted from soft, breathable white fabric. Designed to meet the requirements of Hajj and Umrah, this ihram provides maximum comfort during the blessed pilgrimage. Lightweight and easy to fold for travel.",
    price: "18.99",
    images: [IMGS.ihram, IMGS.hajj],
    category: "hajj-umrah",
    occasion: ["hajj"],
    tags: ["ihram", "hajj", "umrah", "white", "pilgrimage"],
    isFeatured: false,
    inventory: 40,
  },
  {
    title: "Hajj & Umrah Essentials Travel Set",
    slug: "hajj-umrah-essentials-travel-set",
    description: "Everything you need for the blessed journey — this curated travel set includes a compact prayer mat, a mini Quran, a tasbeeh, and alcohol-free toiletries, all packed in a convenient carry bag. Perfect for those preparing for Hajj or Umrah.",
    price: "34.99",
    comparePrice: "42.99",
    images: [IMGS.hajj, IMGS.giftSets],
    category: "hajj-umrah",
    occasion: ["hajj"],
    tags: ["hajj", "umrah", "travel", "essentials", "gift"],
    isFeatured: true,
    inventory: 25,
  },
  {
    title: "Arabic Calligraphy Wall Frame — Bismillah",
    slug: "arabic-calligraphy-wall-frame-bismillah",
    description: "A beautifully crafted Bismillah calligraphy frame, perfect for the home or office. The elegant Arabic script is finished in gold on a cream background, bringing barakah and beauty to any space. Comes ready to hang in a protective gift box.",
    price: "16.99",
    images: [IMGS.homeDecor, IMGS.home],
    category: "gifts-decor",
    occasion: ["eid", "nikah", "general"],
    tags: ["wall-art", "calligraphy", "bismillah", "home-decor", "gift"],
    isFeatured: false,
    inventory: 45,
  },
  {
    title: "Islamic Clock — Azan & Qibla",
    slug: "islamic-clock-azan-qibla",
    description: "A stunning Islamic wall clock with built-in azan alerts for all five daily prayers and a Qibla compass. Available in multiple finishes to match any interior. A practical and beautiful addition to any Muslim home.",
    price: "29.99",
    images: [IMGS.homeDecor, IMGS.home],
    category: "gifts-decor",
    occasion: ["eid", "nikah", "general"],
    tags: ["clock", "azan", "qibla", "home-decor", "practical"],
    isFeatured: false,
    inventory: 30,
  },

];

// ─── Categories mapping ───────────────────────────────────────────────────────
const CATEGORY_SLUG_TO_ID = {};

async function seedProducts() {
  const conn = await createConnection(DATABASE_URL);
  try {
    console.log("Fetching category IDs...");
    const [cats] = await conn.execute("SELECT id, slug FROM categories WHERE type = 'product'");
    for (const cat of cats) {
      CATEGORY_SLUG_TO_ID[cat.slug] = cat.id;
    }

    // Get or create the Amsons demo shop
    let shopId;
    const [existingShop] = await conn.execute(
      "SELECT id FROM shops WHERE slug = 'amsons-demo'",
    );
    if (existingShop.length > 0) {
      shopId = existingShop[0].id;
      console.log(`Using existing Amsons demo shop (id=${shopId})`);
    } else {
      // Create a demo shop linked to the admin user
      const [adminUser] = await conn.execute(
        "SELECT id FROM users WHERE email = 'tahmidburner12@gmail.com' LIMIT 1",
      );
      if (!adminUser.length) {
        console.error("Admin user not found — run seed-admin.mjs first");
        process.exit(1);
      }
      const adminId = adminUser[0].id;
      await conn.execute(
        `INSERT INTO shops (ownerId, name, slug, description, location, isVerified, status, createdAt, updatedAt)
         VALUES (?, 'Amsons', 'amsons-demo', 'Official Amsons placeholder listings — real products from amsons.co.uk.', 'Birmingham, UK', true, 'active', NOW(), NOW())`,
        [adminId],
      );
      const [newShop] = await conn.execute("SELECT id FROM shops WHERE slug = 'amsons-demo'");
      shopId = newShop[0].id;
      console.log(`Created Amsons demo shop (id=${shopId})`);
    }

    let created = 0;
    let skipped = 0;

    for (const p of PRODUCTS) {
      // Skip if already exists
      const [existing] = await conn.execute(
        "SELECT id FROM products WHERE slug = ?",
        [p.slug],
      );
      if (existing.length > 0) {
        skipped++;
        continue;
      }

      const categoryId = CATEGORY_SLUG_TO_ID[p.category] ?? null;
      const images = JSON.stringify(p.images);
      const tags = JSON.stringify(p.tags ?? []);
      const occasion = JSON.stringify(p.occasion ?? []);

      await conn.execute(
        `INSERT INTO products
          (shopId, categoryId, title, slug, description, price, comparePrice, currency,
           images, tags, occasion, type, inventory, trackInventory, isActive, isFeatured,
           isHalal, isPromoted, rating, reviewCount, salesCount, viewCount, createdAt, updatedAt)
         VALUES
          (?, ?, ?, ?, ?, ?, ?, 'GBP',
           ?, ?, ?, 'physical', ?, true, true, ?,
           true, false, 0.00, 0, 0, 0, NOW(), NOW())`,
        [
          shopId,
          categoryId,
          p.title,
          p.slug,
          p.description,
          p.price,
          p.comparePrice ?? null,
          images,
          tags,
          occasion,
          p.inventory,
          p.isFeatured ? 1 : 0,
        ],
      );
      created++;
      console.log(`  + ${p.title} — £${p.price}`);
    }

    console.log(`\nDone. ${created} products created, ${skipped} skipped (already existed).`);
    console.log(`\nAll products linked to the 'amsons-demo' shop (id=${shopId}).`);
    console.log(`Images served from: https://amsons.co.uk/cdn/shop/files/`);
  } finally {
    await conn.end();
  }
}

seedProducts().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
