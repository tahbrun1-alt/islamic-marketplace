/**
 * Seed admin account for Noor Marketplace
 * Run: node scripts/seed-admin.mjs
 */
import { createHash } from "crypto";
import { createConnection } from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const ADMIN_EMAIL = "tahmidburner12@gmail.com";
const ADMIN_PASSWORD = "Qwerty65";
const ADMIN_NAME = "Tahmid (Admin)";

async function seedAdmin() {
  const conn = await createConnection(DATABASE_URL);
  try {
    // Check if admin already exists
    const [rows] = await conn.execute(
      "SELECT id, email, role FROM users WHERE email = ?",
      [ADMIN_EMAIL]
    );
    const existing = rows[0];

    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const openId = `admin_${Date.now()}`;

    if (existing) {
      // Update existing user to admin with new password
      await conn.execute(
        "UPDATE users SET passwordHash = ?, role = 'admin', name = ?, loginMethod = 'email', updatedAt = NOW() WHERE email = ?",
        [passwordHash, ADMIN_NAME, ADMIN_EMAIL]
      );
      console.log(`✅ Updated existing user ${ADMIN_EMAIL} to admin role with new password`);
    } else {
      // Create new admin user
      await conn.execute(
        `INSERT INTO users (openId, name, email, passwordHash, loginMethod, role, createdAt, updatedAt, lastSignedIn)
         VALUES (?, ?, ?, ?, 'email', 'admin', NOW(), NOW(), NOW())`,
        [openId, ADMIN_NAME, ADMIN_EMAIL, passwordHash]
      );
      console.log(`✅ Created admin account: ${ADMIN_EMAIL}`);
    }

    console.log(`\n🔑 Admin credentials:`);
    console.log(`   Email:    ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role:     admin`);
    console.log(`\n🌐 Login at: /login`);
    console.log(`🛡️  Admin panel: /admin`);
  } finally {
    await conn.end();
  }
}

seedAdmin().catch(err => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
