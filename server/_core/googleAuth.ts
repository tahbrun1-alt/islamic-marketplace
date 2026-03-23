/**
 * Google OAuth 2.0 authentication routes.
 * Flow:
 *   1. GET /api/auth/google          → redirect to Google consent screen
 *   2. GET /api/auth/google/callback → exchange code for tokens, upsert user, set session cookie
 */
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";
import { signSessionToken } from "./localAuth";
import { COOKIE_NAME } from "@shared/const";

const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const OAUTH_STATE_COOKIE = "google_oauth_state";

function parseCookies(cookieHeader: string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  if (!cookieHeader) return map;
  for (const part of cookieHeader.split(";")) {
    const [key, ...vals] = part.trim().split("=");
    if (key) map.set(key.trim(), decodeURIComponent(vals.join("=")));
  }
  return map;
}

function getRedirectUri() {
  return `${ENV.appUrl}/api/auth/google/callback`;
}

function buildGoogleAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: ENV.googleClientId,
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

async function exchangeCodeForTokens(code: string): Promise<{ access_token: string } | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: ENV.googleClientId,
      client_secret: ENV.googleClientSecret,
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    console.error("[GoogleAuth] Token exchange failed:", await res.text());
    return null;
  }
  return res.json() as Promise<{ access_token: string }>;
}

async function getGoogleUserInfo(accessToken: string): Promise<{
  sub: string;
  email: string;
  name: string;
  picture?: string;
} | null> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ sub: string; email: string; name: string; picture?: string }>;
}

export function registerGoogleAuthRoutes(app: Express) {
  // Step 1: Redirect to Google
  app.get("/api/auth/google", (req: Request, res: Response) => {
    if (!ENV.googleClientId || !ENV.googleClientSecret) {
      res.status(503).json({ error: "Google OAuth is not configured on this server" });
      return;
    }
    const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
    // Store state in a short-lived cookie for CSRF protection
    res.cookie(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
      sameSite: "lax",
      secure: ENV.isProduction,
    });
    res.redirect(buildGoogleAuthUrl(state));
  });

  // Step 2: Handle callback from Google
  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query as Record<string, string>;

      if (error) {
        console.error("[GoogleAuth] OAuth error from Google:", error);
        res.redirect("/login?auth_error=google_denied");
        return;
      }

      // Validate state (CSRF protection)
      const cookies = parseCookies(req.headers.cookie);
      const savedState = cookies.get(OAUTH_STATE_COOKIE);
      // Clear the state cookie
      res.clearCookie(OAUTH_STATE_COOKIE);

      if (!savedState || savedState !== state) {
        console.warn("[GoogleAuth] State mismatch", { savedState, state });
        res.redirect("/login?auth_error=state_mismatch");
        return;
      }

      if (!code) {
        res.redirect("/login?auth_error=no_code");
        return;
      }

      // Exchange code for tokens
      const tokens = await exchangeCodeForTokens(code);
      if (!tokens?.access_token) {
        res.redirect("/login?auth_error=token_exchange_failed");
        return;
      }

      // Get user info from Google
      const googleUser = await getGoogleUserInfo(tokens.access_token);
      if (!googleUser?.sub || !googleUser?.email) {
        res.redirect("/login?auth_error=userinfo_failed");
        return;
      }

      // Upsert user in database
      const openId = `google_${googleUser.sub}`;
      await db.upsertUser({
        openId,
        email: googleUser.email.toLowerCase().trim(),
        name: googleUser.name,
        loginMethod: "google",
        lastSignedIn: new Date(),
      });

      // Sign session token and set cookie
      const sessionToken = await signSessionToken(openId, googleUser.name);
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Redirect to home page after successful login
      res.redirect("/?auth_success=google");
    } catch (err) {
      console.error("[GoogleAuth] Callback error:", err);
      res.redirect("/login?auth_error=server_error");
    }
  });
}
