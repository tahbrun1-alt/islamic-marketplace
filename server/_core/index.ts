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
    const log: string[] = [];
    try {
      const bcryptjs = await import("bcryptjs");
      const mysql2 = await import("mysql2/promise");
      log.push("imports ok");

      // Use a direct connection with SSL (required for Railway MySQL)
      const conn = await mysql2.default.createConnection({
        uri: process.env.DATABASE_URL!,
        ssl: { rejectUnauthorized: false },
        connectTimeout: 30000,
      });
      log.push("direct connection ok");

      // Run migrations to add missing columns
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
        try { await conn.execute(m); log.push(`migration ok: ${m.slice(0,50)}`); }
        catch (me: any) { log.push(`migration skip: ${me.message.slice(0,60)}`); }
      }

      const hash = await bcryptjs.default.hash("Qwerty65", 10);
      const openId = "local_admin_tahmid";

      const [rows] = await conn.execute(`SELECT id FROM users WHERE email = 'tahmidburner12@gmail.com' LIMIT 1`);
      const existing = rows as any[];
      let action = "";
      if (existing.length > 0) {
        await conn.execute(`UPDATE users SET passwordHash = ?, role = 'admin', name = 'Admin', openId = ? WHERE email = 'tahmidburner12@gmail.com'`, [hash, openId]);
        action = "updated";
      } else {
        await conn.execute(`INSERT INTO users (openId, name, email, passwordHash, role) VALUES (?, 'Admin', 'tahmidburner12@gmail.com', ?, 'admin')`, [openId, hash]);
        action = "created";
      }
      await conn.end();
      log.push(`admin ${action}`);
      return res.json({ ok: true, action, log });
    } catch (e: any) {
      console.error("[Seed] Error:", e);
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
