/**
 * Standalone email+password authentication — NO Manus dependencies.
 * Uses bcryptjs for password hashing and jose for JWT session tokens.
 * Sessions are stored as signed JWT cookies (same cookie name as before).
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import bcrypt from "bcryptjs";
import type { Express, Request, Response } from "express";
import { SignJWT, jwtVerify } from "jose";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";

// ─── JWT helpers ─────────────────────────────────────────────────────────────

function getSecretKey() {
  return new TextEncoder().encode(ENV.cookieSecret || "noor-marketplace-secret-key-change-in-production");
}

export async function signSessionToken(openId: string, name: string): Promise<string> {
  const expirationSeconds = Math.floor((Date.now() + ONE_YEAR_MS) / 1000);
  return new SignJWT({ openId, name, type: "local" })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string | undefined | null): Promise<{ openId: string; name: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), { algorithms: ["HS256"] });
    const { openId, name } = payload as Record<string, unknown>;
    if (typeof openId !== "string" || !openId) return null;
    return { openId, name: typeof name === "string" ? name : "" };
  } catch {
    return null;
  }
}

// ─── Cookie parser ────────────────────────────────────────────────────────────

function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!cookieHeader) return map;
  for (const part of cookieHeader.split(";")) {
    const [key, ...vals] = part.trim().split("=");
    if (key) map.set(key.trim(), decodeURIComponent(vals.join("=")));
  }
  return map;
}

// ─── Request authenticator (replaces sdk.authenticateRequest) ────────────────

export async function authenticateRequest(req: Request) {
  const cookies = parseCookies(req.headers.cookie);
  const sessionCookie = cookies.get(COOKIE_NAME);
  const session = await verifySessionToken(sessionCookie);
  if (!session) throw new Error("Invalid or missing session");
  const user = await db.getUserByOpenId(session.openId);
  if (!user) throw new Error("User not found");
  return user;
}

// ─── Express routes ───────────────────────────────────────────────────────────

export function registerLocalAuthRoutes(app: Express) {
  // POST /api/auth/register
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
      if (!email || !password || !name) {
        res.status(400).json({ error: "Name, email and password are required" });
        return;
      }
      if (password.length < 6) {
        res.status(400).json({ error: "Password must be at least 6 characters" });
        return;
      }
      // Check if email already exists
      const existing = await db.getUserByEmail(email.toLowerCase().trim());
      if (existing) {
        res.status(409).json({ error: "An account with this email already exists" });
        return;
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const openId = `local_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      await db.upsertUser({
        openId,
        passwordHash,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        loginMethod: "email",
        lastSignedIn: new Date(),
      });
      const token = await signSessionToken(openId, name.trim());
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      const user = await db.getUserByOpenId(openId);
      res.json({ success: true, user });
    } catch (error) {
      console.error("[Auth] Register failed", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // POST /api/auth/login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }
      const user = await db.getUserByEmail(email.toLowerCase().trim());
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }
      // Update lastSignedIn
      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
      const token = await signSessionToken(user.openId, user.name ?? "");
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: { ...user, passwordHash: undefined } });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // POST /api/auth/logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });
}
