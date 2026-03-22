/**
 * Standalone image storage — uses Cloudinary (free tier, no Manus dependencies).
 * Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET in env.
 * Falls back gracefully if Cloudinary is not configured.
 */
import crypto from "crypto";

function getCloudinaryConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    apiKey: process.env.CLOUDINARY_API_KEY ?? "",
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
  };
}

function isCloudinaryConfigured() {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  return !!(cloudName && apiKey && apiSecret);
}

function generateSignature(params: Record<string, string>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join("&");
  return crypto.createHash("sha256").update(sorted + apiSecret).digest("hex");
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");

  if (!isCloudinaryConfigured()) {
    // Dev fallback: return a placeholder so the app works without credentials
    console.warn("[Storage] Cloudinary not configured — returning placeholder URL");
    return { key, url: `https://placehold.co/400x300/f5e6c8/b8860b?text=Image` };
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = key.split("/").slice(0, -1).join("/") || "noor-marketplace";
  const publicId = key.split("/").pop()?.replace(/\.[^.]+$/, "") ?? `img-${timestamp}`;

  const params: Record<string, string> = { folder, public_id: publicId, timestamp };
  const signature = generateSignature(params, apiSecret);

  const formData = new FormData();
  const blob = new Blob([data as any], { type: contentType });
  formData.append("file", blob, key.split("/").pop() ?? "file");
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", folder);
  formData.append("public_id", publicId);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const msg = await response.text().catch(() => response.statusText);
    throw new Error(`Cloudinary upload failed (${response.status}): ${msg}`);
  }

  const result = await response.json() as { secure_url: string; public_id: string };
  return { key: result.public_id, url: result.secure_url };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  if (!isCloudinaryConfigured()) {
    return { key, url: "" };
  }
  const { cloudName } = getCloudinaryConfig();
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${key}`;
  return { key, url };
}
