import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

const DB_URL = process.env.DATABASE_URL || "mysql://root:dHYDPnNNxtLqmuRPQRwOOVkKFoJGsVKw@caboose.proxy.rlwy.net:48740/railway";

// Parse the DATABASE_URL
const url = new URL(DB_URL);

const conn = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});

const email = "tahmidburner12@gmail.com";
const password = "Qwerty65";
const hash = await bcrypt.hash(password, 12);

const [rows] = await conn.execute(
  "SELECT id, email, role FROM users WHERE email = ?",
  [email]
);

if (rows.length > 0) {
  await conn.execute(
    "UPDATE users SET passwordHash = ?, role = 'admin', name = 'Admin' WHERE email = ?",
    [hash, email]
  );
  console.log(`✓ Updated admin user (id: ${rows[0].id})`);
} else {
  const [result] = await conn.execute(
    "INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, 'admin')",
    ["Admin", email, hash]
  );
  console.log(`✓ Created admin user (id: ${result.insertId})`);
}

// Also update commission rate to 7%
await conn.execute(
  "UPDATE platformSettings SET value = '7' WHERE `key` = 'commission_rate'"
);
console.log("✓ Commission rate set to 7%");

await conn.end();
console.log("✓ Seeding complete!");
