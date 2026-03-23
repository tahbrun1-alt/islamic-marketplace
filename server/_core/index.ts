import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerLocalAuthRoutes } from "./localAuth";
import { registerGoogleAuthRoutes } from "./googleAuth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerStripeWebhook } from "../stripeWebhook";
import { getDb } from "../db";
import { sql } from "drizzle-orm";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // IMPORTANT: Stripe webhook must be registered BEFORE express.json()
  // to allow raw body access for signature verification
  registerStripeWebhook(app);

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Standalone email+password auth routes (no Manus dependencies)
  registerLocalAuthRoutes(app);
  // Google OAuth routes
  registerGoogleAuthRoutes(app);

  // Health check endpoint for Railway/Docker
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  // One-time admin seed endpoint (protected by secret token)
  app.post("/api/seed-admin", async (req, res) => {
    const { token } = req.body || {};
    if (token !== "noor-seed-2026") return res.status(403).json({ error: "forbidden" });
    const log: string[] = [];
    try {
      const bcryptjs = await import("bcryptjs");
      log.push("imports ok");

      // Use the existing shared database pool (already connected on Railway)
      const db = await getDb();
      if (!db) throw new Error("Database not available - check DATABASE_URL env var");
      log.push("db connection ok via shared pool");

      // Run migrations to add missing columns using raw SQL via drizzle
      const migrations = [
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS passwordHash VARCHAR(255) NULL`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50) NULL`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT NULL`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT NULL`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS location VARCHAR(255) NULL`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS loginMethod VARCHAR(50) NULL DEFAULT 'email'`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS isVerified BOOLEAN NOT NULL DEFAULT false`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS stripeCustomerId VARCHAR(255) NULL`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS lastSignedIn DATETIME NULL`,
      ];
      for (const m of migrations) {
        try { await db.execute(sql.raw(m)); log.push(`migration ok: ${m.slice(0,50)}`); }
        catch (me: any) { log.push(`migration skip: ${me.message.slice(0,60)}`); }
      }

      const hash = await bcryptjs.default.hash("Qwerty65", 10);
      const openId = "local_admin_tahmid";

      const existing = await db.execute(sql.raw(`SELECT id FROM users WHERE email = 'tahmidburner12@gmail.com' LIMIT 1`));
      const rows = (existing as any)[0] as any[];
      let action = "";
      if (rows && rows.length > 0) {
        await db.execute(sql`UPDATE users SET passwordHash = ${hash}, role = 'admin', name = 'Admin', openId = ${openId} WHERE email = 'tahmidburner12@gmail.com'`);
        action = "updated";
      } else {
        await db.execute(sql`INSERT INTO users (openId, name, email, passwordHash, role) VALUES (${openId}, 'Admin', 'tahmidburner12@gmail.com', ${hash}, 'admin')`);
        action = "created";
      }
      log.push(`admin ${action}`);
      return res.json({ ok: true, action, log });
    } catch (e: any) {
      console.error("[Seed] Error:", e);
      return res.status(500).json({ error: e.message, log });
    }
  });

  // Seed products/categories/shop endpoint (protected by secret token)
  app.post("/api/seed-products", async (req, res) => {
    const { token } = req.body || {};
    if (token !== "noor-seed-2026") return res.status(403).json({ error: "forbidden" });
    const log: string[] = [];
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      log.push("db ok");

      // 1. Ensure a demo shop exists (owned by admin user)
      const adminRows = (await db.execute(sql.raw(`SELECT id FROM users WHERE email = 'tahmidburner12@gmail.com' LIMIT 1`)) as any)[0] as any[];
      if (!adminRows?.length) throw new Error("Admin user not found — run /api/seed-admin first");
      const adminId = adminRows[0].id;

      // Create or reuse demo shop
      const shopRows = (await db.execute(sql.raw(`SELECT id FROM shops WHERE ownerId = ${adminId} LIMIT 1`)) as any)[0] as any[];
      let shopId: number;
      if (shopRows?.length) {
        shopId = shopRows[0].id;
        log.push(`reusing shop ${shopId}`);
      } else {
        await db.execute(sql`INSERT INTO shops (ownerId, name, slug, description, status, isVerified, isHalalCertified) VALUES (${adminId}, 'Noor Demo Store', 'noor-demo-store', 'Official demo store for Noor Marketplace', 'active', true, true)`);
        const newShop = (await db.execute(sql.raw(`SELECT id FROM shops WHERE ownerId = ${adminId} LIMIT 1`)) as any)[0] as any[];
        shopId = newShop[0].id;
        log.push(`created shop ${shopId}`);
      }

      // 2. Seed categories
      const cats = [
        { type: 'product', name: 'Dates & Sweets', slug: 'dates', icon: '🌴', sortOrder: 1 },
        { type: 'product', name: 'Prayer Essentials', slug: 'prayer', icon: '🕌', sortOrder: 2 },
        { type: 'product', name: 'Modest Fashion', slug: 'fashion', icon: '👗', sortOrder: 3 },
        { type: 'product', name: 'Quran & Books', slug: 'books', icon: '📖', sortOrder: 4 },
        { type: 'product', name: 'Ramadan Decor', slug: 'decor', icon: '🪔', sortOrder: 5 },
        { type: 'product', name: 'Halal Food', slug: 'food', icon: '🥘', sortOrder: 6 },
        { type: 'product', name: 'Attar & Fragrance', slug: 'fragrance', icon: '🌹', sortOrder: 7 },
        { type: 'product', name: 'Gifts & Hampers', slug: 'gifts', icon: '🎁', sortOrder: 8 },
        { type: 'service', name: 'Islamic Education', slug: 'education', icon: '📚', sortOrder: 1 },
        { type: 'service', name: 'Nikah Services', slug: 'nikah', icon: '💍', sortOrder: 2 },
        { type: 'service', name: 'Halal Catering', slug: 'catering', icon: '🍽️', sortOrder: 3 },
        { type: 'service', name: 'Henna & Beauty', slug: 'beauty', icon: '🌿', sortOrder: 4 },
      ];
      for (const cat of cats) {
        try {
          await db.execute(sql`INSERT IGNORE INTO categories (type, name, slug, icon, sortOrder, isActive) VALUES (${cat.type}, ${cat.name}, ${cat.slug}, ${cat.icon}, ${cat.sortOrder}, true)`);
        } catch { /* ignore duplicates */ }
      }
      log.push("categories seeded");

      // Get category IDs
      const catRows = (await db.execute(sql.raw(`SELECT id, slug FROM categories`)) as any)[0] as any[];
      const catMap: Record<string, number> = {};
      for (const r of catRows) catMap[r.slug] = r.id;

      // 3. Seed placeholder products
      const products = [
        { title: 'Medjool Dates Gift Box (1kg)', slug: 'medjool-dates-gift-box-1kg', desc: 'Premium Medjool dates from Jordan, beautifully packaged in a gift box. Perfect for Ramadan gifting and iftar.', price: '14.99', comparePrice: '19.99', cat: 'dates', tags: ['ramadan','dates','gift'], featured: true, inventory: 50 },
        { title: 'Ramadan Lantern Set (3 Piece)', slug: 'ramadan-lantern-set-3-piece', desc: 'Handcrafted Moroccan-style Ramadan lanterns. Creates a beautiful atmosphere for iftar and suhoor.', price: '24.99', comparePrice: '34.99', cat: 'decor', tags: ['ramadan','decor','lantern'], featured: true, inventory: 30 },
        { title: 'Embroidered Prayer Mat — Madinah Green', slug: 'embroidered-prayer-mat-madinah-green', desc: 'Soft, thick embroidered prayer mat with anti-slip base. Features the Masjid al-Nabawi design.', price: '19.99', comparePrice: null, cat: 'prayer', tags: ['prayer','salah','mat'], featured: true, inventory: 100 },
        { title: 'Quran with Tajweed Rules (Colour Coded)', slug: 'quran-tajweed-colour-coded', desc: 'Full Arabic Quran with colour-coded Tajweed rules. A5 size, hardcover with gold embossing.', price: '12.99', comparePrice: '17.99', cat: 'books', tags: ['quran','books','tajweed'], featured: true, inventory: 75 },
        { title: 'Oud Al Shuyukh Attar (12ml)', slug: 'oud-al-shuyukh-attar-12ml', desc: 'Rich, deep Oud attar from the Arabian Peninsula. Long-lasting, alcohol-free, halal-certified fragrance.', price: '29.99', comparePrice: '39.99', cat: 'fragrance', tags: ['attar','oud','fragrance'], featured: false, inventory: 40 },
        { title: 'Abaya — Classic Black Crepe', slug: 'abaya-classic-black-crepe', desc: 'Elegant open-front abaya in premium crepe fabric. Modest, comfortable and suitable for all occasions.', price: '44.99', comparePrice: '59.99', cat: 'fashion', tags: ['abaya','modest','fashion'], featured: true, inventory: 25 },
        { title: 'Ramadan Advent Calendar (30 Days)', slug: 'ramadan-advent-calendar-30-days', desc: '30-day Ramadan countdown calendar with daily Islamic activities, duas and small treats for children.', price: '18.99', comparePrice: '24.99', cat: 'decor', tags: ['ramadan','children','calendar'], featured: false, inventory: 60 },
        { title: 'Tasbih Prayer Beads — Sandalwood (99 Beads)', slug: 'tasbih-prayer-beads-sandalwood-99', desc: 'Handcrafted sandalwood tasbih with 99 beads. Natural fragrance, smooth finish, comes in a velvet pouch.', price: '9.99', comparePrice: null, cat: 'prayer', tags: ['tasbih','dhikr','prayer'], featured: false, inventory: 150 },
        { title: 'Halal Eid Hamper — Family Size', slug: 'halal-eid-hamper-family-size', desc: 'A curated Eid hamper with dates, sweets, biscuits, tea and a personalised Eid card. Fully halal-certified.', price: '39.99', comparePrice: '54.99', cat: 'gifts', tags: ['eid','hamper','gift'], featured: true, inventory: 20 },
        { title: 'Islamic Wall Art — Ayatul Kursi (Gold)', slug: 'islamic-wall-art-ayatul-kursi-gold', desc: 'Premium canvas print of Ayatul Kursi in elegant gold Arabic calligraphy. Available in 3 sizes.', price: '22.99', comparePrice: '29.99', cat: 'decor', tags: ['art','calligraphy','decor'], featured: false, inventory: 45 },
        { title: 'Sunnah Honey — Sidr Raw (500g)', slug: 'sunnah-honey-sidr-raw-500g', desc: 'Pure Sidr honey from Yemen, cold-extracted and unfiltered. A Sunnah superfood with natural healing properties.', price: '34.99', comparePrice: null, cat: 'food', tags: ['honey','sunnah','food'], featured: false, inventory: 35 },
        { title: 'Children Hijab Set — Pastel Rainbow', slug: 'children-hijab-set-pastel-rainbow', desc: 'Soft jersey hijab set for girls aged 4–12. Comes in 5 pastel colours, easy to wear with inner cap.', price: '11.99', comparePrice: '15.99', cat: 'fashion', tags: ['hijab','children','modest'], featured: false, inventory: 80 },
        { title: 'Miswak Sticks Bundle (12 Pack)', slug: 'miswak-sticks-bundle-12-pack', desc: 'Natural Arak miswak sticks for oral hygiene as per the Sunnah. Fresh, individually wrapped.', price: '6.99', comparePrice: '9.99', cat: 'prayer', tags: ['miswak','sunnah','hygiene'], featured: false, inventory: 200 },
        { title: 'Ramadan Mubarak Balloon Arch Kit', slug: 'ramadan-mubarak-balloon-arch-kit', desc: 'DIY balloon arch kit with gold, purple and white balloons. Includes crescent moon and star foil balloons.', price: '13.99', comparePrice: '18.99', cat: 'decor', tags: ['ramadan','decor','party'], featured: false, inventory: 55 },
        { title: 'Kufiya Kufi Cap — White Knit', slug: 'kufiya-kufi-cap-white-knit', desc: 'Classic white knit kufi cap for men. Breathable, comfortable for daily wear and prayer.', price: '7.99', comparePrice: null, cat: 'fashion', tags: ['kufi','men','prayer'], featured: false, inventory: 120 },
      ];

      let inserted = 0;
      for (const p of products) {
        const catId = catMap[p.cat] ?? null;
        try {
          await db.execute(sql`INSERT IGNORE INTO products (shopId, categoryId, title, slug, description, price, comparePrice, currency, tags, inventory, isActive, isFeatured, isHalal, type) VALUES (${shopId}, ${catId}, ${p.title}, ${p.slug}, ${p.desc}, ${p.price}, ${p.comparePrice}, 'GBP', ${JSON.stringify(p.tags)}, ${p.inventory}, true, ${p.featured}, true, 'physical')`);
          inserted++;
        } catch { /* ignore duplicates */ }
      }
      log.push(`${inserted} products inserted`);

      // 4. Seed placeholder services
      const serviceProviderRows = (await db.execute(sql.raw(`SELECT id FROM users WHERE email = 'tahmidburner12@gmail.com' LIMIT 1`)) as any)[0] as any[];
      const providerId = serviceProviderRows[0].id;

      const services = [
        { title: 'Online Quran Lessons (1-to-1)', slug: 'online-quran-lessons-1to1', desc: 'Personalised 1-to-1 Quran recitation and Tajweed lessons via Zoom. Suitable for all ages and levels.', price: '25.00', cat: 'education', duration: 60, locationType: 'online', featured: true },
        { title: 'Nikah Ceremony Officiation', slug: 'nikah-ceremony-officiation', desc: 'Professional Islamic Nikah ceremony officiation by a qualified Imam. Includes marriage certificate preparation.', price: '200.00', cat: 'nikah', duration: 120, locationType: 'in_person', featured: true },
        { title: 'Halal Wedding Catering (per head)', slug: 'halal-wedding-catering-per-head', desc: 'Full halal wedding catering service. Customisable menus including Pakistani, Moroccan and Middle Eastern cuisines.', price: '35.00', cat: 'catering', duration: 480, locationType: 'at_client', featured: true },
        { title: 'Bridal Henna Design', slug: 'bridal-henna-design', desc: 'Intricate bridal henna design for hands and feet. Using natural henna paste, lasts 2–3 weeks.', price: '80.00', cat: 'beauty', duration: 180, locationType: 'at_client', featured: true },
        { title: 'Arabic Calligraphy Workshop', slug: 'arabic-calligraphy-workshop', desc: 'Learn the art of Arabic calligraphy in a 2-hour group workshop. All materials provided.', price: '45.00', cat: 'education', duration: 120, locationType: 'in_person', featured: false },
        { title: 'Islamic Finance Consultation', slug: 'islamic-finance-consultation', desc: 'One-hour consultation on halal investments, mortgages and financial planning according to Islamic principles.', price: '75.00', cat: 'education', duration: 60, locationType: 'online', featured: false },
      ];

      let servicesInserted = 0;
      for (const s of services) {
        const catId = catMap[s.cat] ?? null;
        try {
          await db.execute(sql`INSERT IGNORE INTO services (providerId, categoryId, title, slug, description, price, currency, duration, locationType, isActive, isFeatured) VALUES (${providerId}, ${catId}, ${s.title}, ${s.slug}, ${s.desc}, ${s.price}, 'GBP', ${s.duration}, ${s.locationType}, true, ${s.featured})`);
          servicesInserted++;
        } catch { /* ignore duplicates */ }
      }
      log.push(`${servicesInserted} services inserted`);

      return res.json({ ok: true, shopId, log });
    } catch (e: any) {
      console.error("[SeedProducts] Error:", e);
      return res.status(500).json({ error: e.message, log });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  // In production (Railway/Docker), bind to 0.0.0.0 so the proxy can reach us.
  // In development, use port scanning to avoid conflicts.
  const isProduction = process.env.NODE_ENV === "production";
  const host = isProduction ? "0.0.0.0" : "127.0.0.1";
  const port = isProduction ? preferredPort : await findAvailablePort(preferredPort);

  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });
}

startServer().catch(console.error);
