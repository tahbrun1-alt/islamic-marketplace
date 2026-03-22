import {
  boolean,
  decimal,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 30 }),
  avatar: text("avatar"),
  bio: text("bio"),
  location: text("location"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Addresses ───────────────────────────────────────────────────────────────

export const addresses = mysqlTable("addresses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  label: varchar("label", { length: 64 }).default("Home"),
  fullName: text("fullName").notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state"),
  postcode: varchar("postcode", { length: 20 }),
  country: varchar("country", { length: 64 }).notNull(),
  phone: varchar("phone", { length: 30 }),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Shops (Seller Profiles) ─────────────────────────────────────────────────

export const shops = mysqlTable("shops", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  logo: text("logo"),
  banner: text("banner"),
  description: text("description"),
  location: text("location"),
  phone: varchar("phone", { length: 30 }),
  email: varchar("email", { length: 320 }),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  tiktok: text("tiktok"),
  businessHours: json("businessHours"),
  isVerified: boolean("isVerified").default(false).notNull(),
  isHalalCertified: boolean("isHalalCertified").default(false).notNull(),
  halalCertDoc: text("halalCertDoc"),
  policies: text("policies"),
  status: mysqlEnum("status", ["pending", "active", "suspended"]).default("pending").notNull(),
  trialEndsAt: timestamp("trialEndsAt"),
  stripeAccountId: varchar("stripeAccountId", { length: 128 }),
  totalSales: int("totalSales").default(0).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: int("reviewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Categories ──────────────────────────────────────────────────────────────

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  parentId: int("parentId"),
  type: mysqlEnum("type", ["product", "service"]).notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  slug: varchar("slug", { length: 128 }).notNull(),
  icon: text("icon"),
  image: text("image"),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
});

// ─── Products ─────────────────────────────────────────────────────────────────

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  shopId: int("shopId").notNull(),
  categoryId: int("categoryId"),
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal("comparePrice", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 8 }).default("GBP").notNull(),
  images: json("images"),
  videos: json("videos"),
  tags: json("tags"),
  type: mysqlEnum("type", ["physical", "digital"]).default("physical").notNull(),
  digitalFileUrl: text("digitalFileUrl"),
  inventory: int("inventory").default(0).notNull(),
  trackInventory: boolean("trackInventory").default(true).notNull(),
  variations: json("variations"),
  shippingWeight: decimal("shippingWeight", { precision: 8, scale: 3 }),
  shippingOptions: json("shippingOptions"),
  processingTime: varchar("processingTime", { length: 64 }),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isPromoted: boolean("isPromoted").default(false).notNull(),
  isHalal: boolean("isHalal").default(true).notNull(),
  occasion: json("occasion"),
  gender: mysqlEnum("gender", ["all", "male", "female", "children"]).default("all"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: int("reviewCount").default(0).notNull(),
  salesCount: int("salesCount").default(0).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Services ─────────────────────────────────────────────────────────────────

export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(),
  categoryId: int("categoryId"),
  title: varchar("title", { length: 256 }).notNull(),
  slug: varchar("slug", { length: 256 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("depositAmount", { precision: 10, scale: 2 }),
  requireDeposit: boolean("requireDeposit").default(false).notNull(),
  currency: varchar("currency", { length: 8 }).default("GBP").notNull(),
  duration: int("duration").notNull(),
  images: json("images"),
  videos: json("videos"),
  tags: json("tags"),
  locationType: mysqlEnum("locationType", ["online", "in_person", "at_client", "at_provider"]).default("in_person").notNull(),
  address: text("address"),
  packages: json("packages"),
  addons: json("addons"),
  cancellationPolicy: text("cancellationPolicy"),
  availability: json("availability"),
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isPromoted: boolean("isPromoted").default(false).notNull(),
  allowRecurring: boolean("allowRecurring").default(false).notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: int("reviewCount").default(0).notNull(),
  bookingCount: int("bookingCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 32 }).notNull().unique(),
  buyerId: int("buyerId").notNull(),
  shopId: int("shopId").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0.00").notNull(),
  discountAmount: decimal("discountAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).default("GBP").notNull(),
  couponCode: varchar("couponCode", { length: 64 }),
  shippingAddress: json("shippingAddress"),
  shippingMethod: text("shippingMethod"),
  trackingNumber: text("trackingNumber"),
  notes: text("notes"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  payoutStatus: mysqlEnum("payoutStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  payoutAmount: decimal("payoutAmount", { precision: 10, scale: 2 }),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
  title: text("title").notNull(),
  image: text("image"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  variation: json("variation"),
  digitalFileUrl: text("digitalFileUrl"),
});

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  bookingNumber: varchar("bookingNumber", { length: 32 }).notNull().unique(),
  serviceId: int("serviceId").notNull(),
  clientId: int("clientId").notNull(),
  providerId: int("providerId").notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled", "no_show", "refunded"]).default("pending").notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").notNull(),
  packageId: varchar("packageId", { length: 64 }),
  addons: json("addons"),
  locationType: mysqlEnum("locationType", ["online", "in_person", "at_client", "at_provider"]).default("in_person").notNull(),
  address: text("address"),
  meetingLink: text("meetingLink"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  depositAmount: decimal("depositAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  commissionAmount: decimal("commissionAmount", { precision: 10, scale: 2 }).default("0.00").notNull(),
  currency: varchar("currency", { length: 8 }).default("GBP").notNull(),
  notes: text("notes"),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 128 }),
  payoutStatus: mysqlEnum("payoutStatus", ["pending", "paid", "failed"]).default("pending").notNull(),
  isRecurring: boolean("isRecurring").default(false).notNull(),
  recurringPattern: json("recurringPattern"),
  reminderSent: boolean("reminderSent").default(false).notNull(),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["product", "service", "shop"]).notNull(),
  targetId: int("targetId").notNull(),
  authorId: int("authorId").notNull(),
  orderId: int("orderId"),
  bookingId: int("bookingId"),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 256 }),
  body: text("body"),
  images: json("images"),
  isVerifiedPurchase: boolean("isVerifiedPurchase").default(false).notNull(),
  isVisible: boolean("isVisible").default(true).notNull(),
  sellerReply: text("sellerReply"),
  sellerRepliedAt: timestamp("sellerRepliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Messages ─────────────────────────────────────────────────────────────────

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["buyer_seller", "buyer_provider", "support"]).default("buyer_seller").notNull(),
  participant1Id: int("participant1Id").notNull(),
  participant2Id: int("participant2Id").notNull(),
  productId: int("productId"),
  serviceId: int("serviceId"),
  orderId: int("orderId"),
  bookingId: int("bookingId"),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(),
  senderId: int("senderId").notNull(),
  body: text("body").notNull(),
  attachments: json("attachments"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: varchar("type", { length: 64 }).notNull(),
  title: text("title").notNull(),
  body: text("body"),
  data: json("data"),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Wishlists ────────────────────────────────────────────────────────────────

export const wishlists = mysqlTable("wishlists", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  productId: int("productId"),
  serviceId: int("serviceId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Coupons ──────────────────────────────────────────────────────────────────

export const coupons = mysqlTable("coupons", {
  id: int("id").autoincrement().primaryKey(),
  shopId: int("shopId"),
  code: varchar("code", { length: 64 }).notNull().unique(),
  type: mysqlEnum("type", ["percentage", "fixed"]).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: decimal("minOrderAmount", { precision: 10, scale: 2 }),
  maxUses: int("maxUses"),
  usedCount: int("usedCount").default(0).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reports = mysqlTable("reports", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull(),
  type: mysqlEnum("type", ["product", "service", "shop", "user", "review", "message"]).notNull(),
  targetId: int("targetId").notNull(),
  reason: varchar("reason", { length: 128 }).notNull(),
  details: text("details"),
  status: mysqlEnum("status", ["pending", "reviewed", "resolved", "dismissed"]).default("pending").notNull(),
  resolvedBy: int("resolvedBy"),
  resolution: text("resolution"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Payouts ──────────────────────────────────────────────────────────────────

export const payouts = mysqlTable("payouts", {
  id: int("id").autoincrement().primaryKey(),
  shopId: int("shopId").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).default("GBP").notNull(),
  status: mysqlEnum("status", ["pending", "processing", "paid", "failed"]).default("pending").notNull(),
  stripeTransferId: varchar("stripeTransferId", { length: 128 }),
  periodStart: timestamp("periodStart").notNull(),
  periodEnd: timestamp("periodEnd").notNull(),
  orderIds: json("orderIds"),
  bookingIds: json("bookingIds"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  paidAt: timestamp("paidAt"),
});

// ─── Promotions ───────────────────────────────────────────────────────────────

export const promotions = mysqlTable("promotions", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["banner", "featured_product", "featured_service", "featured_shop", "seasonal"]).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  image: text("image"),
  linkUrl: text("linkUrl"),
  targetId: int("targetId"),
  targetType: varchar("targetType", { length: 32 }),
  season: varchar("season", { length: 64 }),
  isActive: boolean("isActive").default(true).notNull(),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Platform Settings ────────────────────────────────────────────────────────

export const platformSettings = mysqlTable("platformSettings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 128 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
