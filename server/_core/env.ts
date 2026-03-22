export const ENV = {
  cookieSecret: process.env.JWT_SECRET ?? "noor-marketplace-secret-change-in-production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  isProduction: process.env.NODE_ENV === "production",
  // LLM for AI product import (OpenAI-compatible)
  llmApiUrl: process.env.LLM_API_URL ?? "https://api.openai.com/v1/chat/completions",
  llmApiKey: process.env.OPENAI_API_KEY ?? process.env.LLM_API_KEY ?? "",
  llmModel: process.env.LLM_MODEL ?? "gpt-4o-mini",
  // Stripe
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? "",
  // S3 / image storage (optional)
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  awsRegion: process.env.AWS_REGION ?? "us-east-1",
  s3Bucket: process.env.S3_BUCKET ?? "",
};
