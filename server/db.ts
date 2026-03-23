import { and, desc, eq, ilike, inArray, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  InsertUser,
  addresses,
  bookings,
  categories,
  conversations,
  coupons,
  follows,
  messages,
  notifications,
  orderItems,
  orders,
  payouts,
  platformSettings,
  products,
  promotions,
  reports,
  reviews,
  services,
  shops,
  users,
  wishlists,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;
let _pool: mysql.Pool | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const dbUrl = new URL(process.env.DATABASE_URL);
      
      _pool = mysql.createPool({
        host: dbUrl.hostname,
        port: parseInt(dbUrl.port || '3306'),
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000,
        connectTimeout: 30000,
        ssl: 'amazon',
      });
      _db = drizzle(_pool);
      console.log("[Database] Connected via pool");
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;

  for (const field of textFields) {
    const value = user[field];
    if (value !== undefined) {
      values[field] = value ?? null;
      updateSet[field] = value ?? null;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function updateUser(id: number, data: Partial<typeof users.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function getAllUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
}

// ─── Shops ───────────────────────────────────────────────────────────────────

export async function createShop(data: typeof shops.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(shops).values(data);
  return result;
}

export async function getShopBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shops).where(eq(shops.slug, slug)).limit(1);
  return result[0];
}

export async function getShopByOwnerId(ownerId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shops).where(eq(shops.ownerId, ownerId)).limit(1);
  return result[0];
}

export async function getShopById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(shops).where(eq(shops.id, id)).limit(1);
  return result[0];
}

export async function updateShop(id: number, data: Partial<typeof shops.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(shops).set(data).where(eq(shops.id, id));
}

export async function getFeaturedShops(limit = 8) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shops).where(and(eq(shops.status, "active"), eq(shops.isVerified, true))).orderBy(desc(shops.totalSales)).limit(limit);
}

export async function getAllShops(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(shops).orderBy(desc(shops.createdAt)).limit(limit).offset(offset);
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(type?: "product" | "service") {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(categories).where(eq(categories.isActive, true));
  if (type) {
    return db.select().from(categories).where(and(eq(categories.isActive, true), eq(categories.type, type))).orderBy(categories.sortOrder);
  }
  return query.orderBy(categories.sortOrder);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function createProduct(data: typeof products.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const result = await db.insert(products).values(data);
  return result;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function getProducts(opts: {
  shopId?: number;
  categoryId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  occasion?: string;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: string;
}) {
  const db = await getDb();
  if (!db) return [];
  const { limit = 24, offset = 0 } = opts;

  const conditions = [eq(products.isActive, true)];
  if (opts.shopId) conditions.push(eq(products.shopId, opts.shopId));
  if (opts.categoryId) conditions.push(eq(products.categoryId, opts.categoryId));
  if (opts.isFeatured) conditions.push(eq(products.isFeatured, true));
  if (opts.gender && opts.gender !== "all") {
    conditions.push(
      or(
        eq(products.gender, opts.gender as "all" | "male" | "female" | "children"),
        eq(products.gender, "all")
      ) as ReturnType<typeof eq>
    );
  }
  if (opts.occasion) {
    // occasion is stored as a JSON array — use JSON_CONTAINS for MySQL
    conditions.push(
      sql`JSON_CONTAINS(${products.occasion}, ${JSON.stringify(opts.occasion)})` as unknown as ReturnType<typeof eq>
    );
  }
  if (opts.search) {
    conditions.push(
      or(
        like(products.title, `%${opts.search}%`),
        like(products.description, `%${opts.search}%`)
      ) as ReturnType<typeof eq>
    );
  }

  let orderCol = desc(products.createdAt);
  if (opts.sortBy === "price_asc") orderCol = products.price as unknown as ReturnType<typeof desc>;
  if (opts.sortBy === "price_desc") orderCol = desc(products.price);
  if (opts.sortBy === "rating") orderCol = desc(products.rating);
  if (opts.sortBy === "popular") orderCol = desc(products.salesCount);

  return db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(orderCol)
    .limit(limit)
    .offset(offset);
}

export async function getFeaturedProducts(limit = 8) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(and(eq(products.isActive, true), eq(products.isFeatured, true))).orderBy(desc(products.salesCount)).limit(limit);
}

export async function updateProduct(id: number, data: Partial<typeof products.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(products).set({ isActive: false }).where(eq(products.id, id));
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function createService(data: typeof services.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(services).values(data);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result[0];
}

export async function getServiceBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return result[0];
}

export async function getServices(opts: {
  providerId?: number;
  categoryId?: number;
  search?: string;
  locationType?: string;
  isFeatured?: boolean;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return [];
  const { limit = 24, offset = 0 } = opts;
  const conditions = [eq(services.isActive, true)];
  if (opts.providerId) conditions.push(eq(services.providerId, opts.providerId));
  if (opts.categoryId) conditions.push(eq(services.categoryId, opts.categoryId));
  if (opts.isFeatured) conditions.push(eq(services.isFeatured, true));
  if (opts.search) {
    conditions.push(
      or(
        like(services.title, `%${opts.search}%`),
        like(services.description, `%${opts.search}%`)
      ) as ReturnType<typeof eq>
    );
  }
  return db.select().from(services).where(and(...conditions)).orderBy(desc(services.createdAt)).limit(limit).offset(offset);
}

export async function updateService(id: number, data: Partial<typeof services.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(services).set({ isActive: false }).where(eq(services.id, id));
}
// ─── Orders ───────────────────────────────────────────────────────────────────
export async function createOrder(orderData: typeof orders.$inferInsert, items: typeof orderItems.$inferInsert[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(orders).values(orderData);
  if (items.length > 0) await db.insert(orderItems).values(items);
}

export async function getOrdersByBuyer(buyerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.buyerId, buyerId)).orderBy(desc(orders.createdAt));
}

export async function getOrdersByShop(shopId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.shopId, shopId)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function updateOrder(id: number, data: Partial<typeof orders.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(orders).set(data).where(eq(orders.id, id));
}

export async function getAllOrders(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(limit).offset(offset);
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function createBooking(data: typeof bookings.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(bookings).values(data);
}

export async function getBookingsByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.clientId, clientId)).orderBy(desc(bookings.createdAt));
}

export async function getBookingsByProvider(providerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).where(eq(bookings.providerId, providerId)).orderBy(desc(bookings.scheduledAt));
}

export async function getBookingById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return result[0];
}

export async function updateBooking(id: number, data: Partial<typeof bookings.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(bookings).set(data).where(eq(bookings.id, id));
}

export async function getAllBookings(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(limit).offset(offset);
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export async function createReview(data: typeof reviews.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(reviews).values(data);
}

export async function getReviews(type: "product" | "service" | "shop", targetId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reviews).where(and(eq(reviews.type, type), eq(reviews.targetId, targetId), eq(reviews.isVisible, true))).orderBy(desc(reviews.createdAt));
}

export async function getReviewByAuthorAndTarget(authorId: number, type: "product" | "service" | "shop", targetId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(reviews).where(and(eq(reviews.authorId, authorId), eq(reviews.type, type), eq(reviews.targetId, targetId))).limit(1);
  return result[0];
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export async function getOrCreateConversation(p1: number, p2: number, opts?: { productId?: number; serviceId?: number }) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db.select().from(conversations).where(
    or(
      and(eq(conversations.participant1Id, p1), eq(conversations.participant2Id, p2)),
      and(eq(conversations.participant1Id, p2), eq(conversations.participant2Id, p1))
    ) as ReturnType<typeof eq>
  ).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(conversations).values({ participant1Id: p1, participant2Id: p2, ...opts });
  const created = await db.select().from(conversations).where(
    and(eq(conversations.participant1Id, p1), eq(conversations.participant2Id, p2))
  ).limit(1);
  return created[0];
}

export async function getConversationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const convs = await db.select().from(conversations).where(
    or(eq(conversations.participant1Id, userId), eq(conversations.participant2Id, userId)) as ReturnType<typeof eq>
  ).orderBy(desc(conversations.lastMessageAt));
  // Enrich with other user info, last message, product, and service
  const enriched = await Promise.all(convs.map(async (conv) => {
    const otherUserId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
    const otherUserRows = await db.select({ id: users.id, name: users.name, avatar: users.avatar }).from(users).where(eq(users.id, otherUserId)).limit(1);
    const lastMsgRows = await db.select({ body: messages.body, createdAt: messages.createdAt, senderId: messages.senderId }).from(messages).where(eq(messages.conversationId, conv.id)).orderBy(desc(messages.createdAt)).limit(1);
    let product: { id: number; title: string; images: unknown } | null = null;
    let service: { id: number; title: string; images: unknown } | null = null;
    if (conv.productId) {
      const pRows = await db.select({ id: products.id, title: products.title, images: products.images }).from(products).where(eq(products.id, conv.productId)).limit(1);
      product = pRows[0] ?? null;
    }
    if (conv.serviceId) {
      const sRows = await db.select({ id: services.id, title: services.title, images: services.images }).from(services).where(eq(services.id, conv.serviceId)).limit(1);
      service = sRows[0] ?? null;
    }
    return {
      ...conv,
      otherUser: otherUserRows[0] ?? { id: otherUserId, name: "Unknown User", avatar: null },
      lastMessage: lastMsgRows[0] ?? null,
      product,
      service,
    };
  }));
  return enriched;
}

export async function getMessages(conversationId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(desc(messages.createdAt)).limit(limit);
}

export async function sendMessage(data: typeof messages.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(messages).values(data);
  await db.update(conversations).set({ lastMessageAt: new Date() }).where(eq(conversations.id, data.conversationId));
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function createNotification(data: typeof notifications.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(notifications).values(data);
}

export async function getNotifications(userId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return result[0]?.count ?? 0;
}

export async function markNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
}

// ─── Wishlists ────────────────────────────────────────────────────────────────

export async function addToWishlist(userId: number, productId?: number, serviceId?: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(wishlists).values({ userId, productId, serviceId });
}

export async function removeFromWishlist(userId: number, productId?: number, serviceId?: number) {
  const db = await getDb();
  if (!db) return;
  const conditions = [eq(wishlists.userId, userId)];
  if (productId) conditions.push(eq(wishlists.productId, productId));
  if (serviceId) conditions.push(eq(wishlists.serviceId, serviceId));
  await db.delete(wishlists).where(and(...conditions));
}

export async function getWishlist(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(wishlists).where(eq(wishlists.userId, userId));
}

export async function isInWishlist(userId: number, productId?: number, serviceId?: number) {
  const db = await getDb();
  if (!db) return false;
  const conditions = [eq(wishlists.userId, userId)];
  if (productId) conditions.push(eq(wishlists.productId, productId));
  if (serviceId) conditions.push(eq(wishlists.serviceId, serviceId));
  const result = await db.select().from(wishlists).where(and(...conditions)).limit(1);
  return result.length > 0;
}

// ─── Coupons ──────────────────────────────────────────────────────────────────

export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(coupons).where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.isActive, true))).limit(1);
  return result[0];
}

export async function useCoupon(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(coupons).set({ usedCount: sql`usedCount + 1` }).where(eq(coupons.id, id));
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export async function createReport(data: typeof reports.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(reports).values(data);
}

export async function getAllReports(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reports).orderBy(desc(reports.createdAt)).limit(limit).offset(offset);
}

// ─── Promotions ───────────────────────────────────────────────────────────────

export async function getActivePromotions(type?: string) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(promotions.isActive, true)];
  if (type) conditions.push(eq(promotions.type, type as typeof promotions.$inferSelect.type));
  return db.select().from(promotions).where(and(...conditions)).orderBy(promotions.sortOrder);
}

// ─── Platform Settings ────────────────────────────────────────────────────────

export async function getPlatformSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(platformSettings).where(eq(platformSettings.key, key)).limit(1);
  return result[0]?.value ?? null;
}

export async function setPlatformSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(platformSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return null;
  const [userCount, shopCount, productCount, orderCount, bookingCount, revenueData, serviceCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(shops),
    db.select({ count: sql<number>`count(*)` }).from(products),
    db.select({ count: sql<number>`count(*)` }).from(orders),
    db.select({ count: sql<number>`count(*)` }).from(bookings),
    db.select({ total: sql<string>`COALESCE(SUM(total), 0)` }).from(orders).where(sql`status != 'cancelled'`),
    db.select({ count: sql<number>`count(*)` }).from(services),
  ]);
  const grossRevenue = Number(revenueData[0]?.total ?? 0);
  const platformRevenue = grossRevenue * 0.065;
  const charityDonated = grossRevenue * 0.005;
  return {
    users: userCount[0]?.count ?? 0,
    shops: shopCount[0]?.count ?? 0,
    products: productCount[0]?.count ?? 0,
    services: serviceCount[0]?.count ?? 0,
    orders: orderCount[0]?.count ?? 0,
    bookings: bookingCount[0]?.count ?? 0,
    grossRevenue,
    platformRevenue,
    charityDonated,
  };
}

export async function getShopStats(shopId: number) {
  const db = await getDb();
  if (!db) return null;
  const [productCount, orderCount, bookingCount, revenueData, serviceCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(products).where(eq(products.shopId, shopId)),
    db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.shopId, shopId)),
    db.select({ count: sql<number>`count(*)` }).from(bookings).where(eq(bookings.providerId, shopId)),
    db.select({ total: sql<string>`COALESCE(SUM(total), 0)` }).from(orders).where(and(eq(orders.shopId, shopId), sql`status != 'cancelled'`)),
    db.select({ count: sql<number>`count(*)` }).from(services).where(eq(services.shopId, shopId)),
  ]);
  const grossRevenue = Number(revenueData[0]?.total ?? 0);
  const platformFee = grossRevenue * 0.065;
  const charityFee = grossRevenue * 0.005;
  const netRevenue = grossRevenue - platformFee - charityFee;
  return {
    products: productCount[0]?.count ?? 0,
    orders: orderCount[0]?.count ?? 0,
    bookings: bookingCount[0]?.count ?? 0,
    services: serviceCount[0]?.count ?? 0,
    grossRevenue,
    platformFee,
    charityFee,
    netRevenue,
  };
}

// ─── Addresses ───────────────────────────────────────────────────────────────

export async function getAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(addresses).where(eq(addresses.userId, userId));
}

export async function createAddress(data: typeof addresses.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  return db.insert(addresses).values(data);
}

export async function updateAddress(id: number, data: Partial<typeof addresses.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  await db.update(addresses).set(data).where(eq(addresses.id, id));
}

export async function deleteAddress(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(addresses).where(eq(addresses.id, id));
}

// ─── Follows ──────────────────────────────────────────────────────────────────

export async function followShop(followerId: number, shopId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(follows).values({ followerId, shopId }).onDuplicateKeyUpdate({ set: { shopId } });
  await db.update(shops).set({ followerCount: sql`followerCount + 1` }).where(eq(shops.id, shopId));
}

export async function unfollowShop(followerId: number, shopId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(follows).where(and(eq(follows.followerId, followerId), eq(follows.shopId, shopId)));
  await db.update(shops).set({ followerCount: sql`GREATEST(followerCount - 1, 0)` }).where(eq(shops.id, shopId));
}

export async function isFollowingShop(followerId: number, shopId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.shopId, shopId))).limit(1);
  return result.length > 0;
}

export async function getFollowedShops(followerId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(follows).where(eq(follows.followerId, followerId));
  if (!rows.length) return [];
  const shopIds = rows.map((r) => r.shopId);
  return db.select().from(shops).where(inArray(shops.id, shopIds));
}
