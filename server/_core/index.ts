import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerLocalAuthRoutes } from "./localAuth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { registerStripeWebhook } from "../stripeWebhook";

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

  // Health check endpoint for Railway/Docker
  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  // One-time admin seed endpoint (protected by secret token)
  app.post("/api/seed-admin", async (req, res) => {
    const { token } = req.body || {};
    if (token !== "noor-seed-2026") return res.status(403).json({ error: "forbidden" });
    try {
      const bcryptjs = await import("bcryptjs");
      const mysql2 = await import("mysql2/promise");
      const url = new URL(process.env.DATABASE_URL || "");
      const conn = await mysql2.default.createConnection({
        host: url.hostname,
        port: parseInt(url.port || "3306"),
        user: url.username,
        password: url.password,
        database: url.pathname.slice(1),
        ssl: url.hostname.includes("railway.internal") ? undefined : { rejectUnauthorized: false },
      });
      // Run missing migrations (safe — uses IF NOT EXISTS / IGNORE)
      const migrations = [
        "ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `passwordHash` text",
        "ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `phone` varchar(30)",
        "ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `avatar` text",
        "ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `bio` text",
        "ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `location` text",
        "ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `isVerified` boolean NOT NULL DEFAULT false",
        "ALTER TABLE `users` ADD COLUMN IF NOT EXISTS `stripeCustomerId` varchar(128)",
        "ALTER TABLE `bookings` ADD COLUMN IF NOT EXISTS `depositPaid` boolean NOT NULL DEFAULT false",
        "ALTER TABLE `bookings` ADD COLUMN IF NOT EXISTS `platformFee` decimal(10,2) DEFAULT '0.00'",
        "ALTER TABLE `bookings` ADD COLUMN IF NOT EXISTS `charityFee` decimal(10,2) DEFAULT '0.00'",
        "ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `platformFee` decimal(10,2) DEFAULT '0.00'",
        "ALTER TABLE `orders` ADD COLUMN IF NOT EXISTS `charityFee` decimal(10,2) DEFAULT '0.00'",
        "ALTER TABLE `users` ADD UNIQUE IF NOT EXISTS `users_email_unique` (`email`)",
      ];
      const migrationResults: string[] = [];
      for (const sql of migrations) {
        try { await conn.execute(sql); migrationResults.push(`OK: ${sql.slice(0, 60)}`); }
        catch (e: any) { migrationResults.push(`SKIP: ${e.message.slice(0, 80)}`); }
      }
      // Seed admin user
      const hash = await bcryptjs.default.hash("Qwerty65", 12);
      const openId = "local_admin_tahmid";
      const [existing] = await conn.execute("SELECT id FROM users WHERE email = ?", ["tahmidburner12@gmail.com"]);
      let action = "";
      if ((existing as any[]).length > 0) {
        await conn.execute("UPDATE users SET passwordHash = ?, role = 'admin', name = 'Admin', openId = ? WHERE email = ?", [hash, openId, "tahmidburner12@gmail.com"]);
        action = "updated";
      } else {
        await conn.execute("INSERT INTO users (openId, name, email, passwordHash, role) VALUES (?, 'Admin', ?, ?, 'admin')", [openId, "tahmidburner12@gmail.com", hash]);
        action = "created";
      }
      // Update commission rate
      await conn.execute("UPDATE platformSettings SET value = '7' WHERE `key` = 'commission_rate'").catch(() => {});
      await conn.end();
      return res.json({ ok: true, action, migrations: migrationResults });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
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
