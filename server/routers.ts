import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { storagePut } from "./storage";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

// Admin guard — only the designated admin email may access admin routes
const ADMIN_EMAIL = "tahmidburner12@gmail.com";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin" || ctx.user.email !== ADMIN_EMAIL) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

// Helpers 

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

const COMMISSION_RATE = 0.065; // 6.5%
const TRIAL_DAYS = 14;

function isInTrial(trialEndsAt: Date | null | undefined) {
  if (!trialEndsAt) return false;
  return new Date() < trialEndsAt;
}

function calcCommission(amount: number, trialEndsAt: Date | null | undefined) {
  if (isInTrial(trialEndsAt)) return 0;
  return parseFloat((amount * COMMISSION_RATE).toFixed(2));
}

// Main Router 

export const appRouter = router({
  system: systemRouter,

  // Auth 
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(128).optional(),
        bio: z.string().max(500).optional(),
        phone: z.string().max(30).optional(),
        location: z.string().max(256).optional(),
        avatar: z.string().url().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUser(ctx.user.id, input);
        return { success: true };
      }),
  }),

  // Categories 
  categories: router({
    list: publicProcedure
      .input(z.object({ type: z.enum(["product", "service"]).optional() }))
      .query(({ input }) => db.getCategories(input.type)),
  }),

  // Shops 
  shops: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(2).max(128),
        description: z.string().max(2000).optional(),
        location: z.string().max(256).optional(),
        phone: z.string().max(30).optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        tiktok: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getShopByOwnerId(ctx.user.id);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "You already have a shop" });
        const slug = slugify(input.name) + "-" + nanoid(6);
        const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
        await db.createShop({ ...input, ownerId: ctx.user.id, slug, trialEndsAt, status: "active" });
        return { success: true, slug };
      }),
    myShop: protectedProcedure.query(async ({ ctx }) => {
      return db.getShopByOwnerId(ctx.user.id);
    }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => db.getShopBySlug(input.slug)),
    update: protectedProcedure
      .input(z.object({
        name: z.string().min(2).max(128).optional(),
        description: z.string().max(2000).optional(),
        logo: z.string().url().optional(),
        banner: z.string().url().optional(),
        location: z.string().max(256).optional(),
        phone: z.string().max(30).optional(),
        email: z.string().email().optional(),
        website: z.string().url().optional(),
        instagram: z.string().optional(),
        facebook: z.string().optional(),
        tiktok: z.string().optional(),
        policies: z.string().max(5000).optional(),
        businessHours: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopByOwnerId(ctx.user.id);
        if (!shop) throw new TRPCError({ code: "NOT_FOUND" });
        await db.updateShop(shop.id, input);
        return { success: true };
      }),
    featured: publicProcedure.query(() => db.getFeaturedShops(8)),
    list: publicProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllShops(input.limit, input.offset)),
    stats: protectedProcedure.query(async ({ ctx }) => {
      const shop = await db.getShopByOwnerId(ctx.user.id);
      if (!shop) return null;
      return db.getShopStats(shop.id);
    }),
  }),

  // Products 
  products: router({
    list: publicProcedure
      .input(z.object({
        shopId: z.number().optional(),
        categoryId: z.number().optional(),
        search: z.string().optional(),
        gender: z.string().optional(),
        isFeatured: z.boolean().optional(),
        sortBy: z.string().optional(),
        limit: z.number().default(24),
        offset: z.number().default(0),
      }))
      .query(({ input }) => db.getProducts(input)),
    featured: publicProcedure.query(() => db.getFeaturedProducts(8)),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getProductById(input.id)),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => db.getProductBySlug(input.slug)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(2).max(256),
        description: z.string().max(5000).optional(),
        price: z.number().positive(),
        comparePrice: z.number().positive().optional(),
        categoryId: z.number().optional(),
        type: z.enum(["physical", "digital"]).default("physical"),
        images: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        inventory: z.number().int().min(0).default(0),
        variations: z.any().optional(),
        shippingOptions: z.any().optional(),
        processingTime: z.string().optional(),
        gender: z.enum(["all", "male", "female", "children"]).default("all"),
        occasion: z.array(z.string()).optional(),
        digitalFileUrl: z.string().url().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopByOwnerId(ctx.user.id);
        if (!shop) throw new TRPCError({ code: "NOT_FOUND", message: "Create a shop first" });
        const slug = slugify(input.title) + "-" + nanoid(6);
        const { price, comparePrice, ...rest } = input;
        await db.createProduct({
          ...rest,
          shopId: shop.id,
          slug,
          price: price.toFixed(2) as unknown as typeof import("../drizzle/schema").products.$inferInsert.price,
          comparePrice: comparePrice != null ? comparePrice.toFixed(2) as unknown as typeof import("../drizzle/schema").products.$inferInsert.comparePrice : undefined,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(2).max(256).optional(),
        description: z.string().max(5000).optional(),
        price: z.number().positive().optional(),
        comparePrice: z.number().positive().optional(),
        categoryId: z.number().optional(),
        images: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        inventory: z.number().int().min(0).optional(),
        variations: z.any().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        gender: z.enum(["all", "male", "female", "children"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopByOwnerId(ctx.user.id);
        if (!shop) throw new TRPCError({ code: "NOT_FOUND" });
        const product = await db.getProductById(input.id);
        if (!product || product.shopId !== shop.id) throw new TRPCError({ code: "FORBIDDEN" });
        const { id, price, comparePrice, ...rest } = input;
        const data: Record<string, unknown> = { ...rest };
        if (price !== undefined) data.price = price.toFixed(2);
        if (comparePrice !== undefined) data.comparePrice = comparePrice.toFixed(2);
        await db.updateProduct(id, data as Parameters<typeof db.updateProduct>[1]);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopByOwnerId(ctx.user.id);
        if (!shop) throw new TRPCError({ code: "NOT_FOUND" });
        const product = await db.getProductById(input.id);
        if (!product || product.shopId !== shop.id) throw new TRPCError({ code: "FORBIDDEN" });
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // Services 
  services: router({
    list: publicProcedure
      .input(z.object({
        providerId: z.number().optional(),
        categoryId: z.number().optional(),
        search: z.string().optional(),
        locationType: z.string().optional(),
        isFeatured: z.boolean().optional(),
        limit: z.number().default(24),
        offset: z.number().default(0),
      }))
      .query(({ input }) => db.getServices(input)),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => db.getServiceById(input.id)),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => db.getServiceBySlug(input.slug)),
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(2).max(256),
        description: z.string().max(5000).optional(),
        price: z.number().positive(),
        depositAmount: z.number().positive().optional(),
        requireDeposit: z.boolean().default(false),
        duration: z.number().int().positive(),
        categoryId: z.number().optional(),
        locationType: z.enum(["online", "in_person", "at_client", "at_provider"]).default("in_person"),
        address: z.string().optional(),
        images: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        packages: z.any().optional(),
        addons: z.any().optional(),
        cancellationPolicy: z.string().optional(),
        availability: z.any().optional(),
        allowRecurring: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        const slug = slugify(input.title) + "-" + nanoid(6);
        const { price, depositAmount, ...rest } = input;
        await db.createService({
          ...rest,
          providerId: ctx.user.id,
          slug,
          price: price.toFixed(2) as unknown as typeof import("../drizzle/schema").services.$inferInsert.price,
          depositAmount: depositAmount != null ? depositAmount.toFixed(2) as unknown as typeof import("../drizzle/schema").services.$inferInsert.depositAmount : undefined,
        });
        return { success: true };
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(2).max(256).optional(),
        description: z.string().max(5000).optional(),
        price: z.number().positive().optional(),
        depositAmount: z.number().positive().optional(),
        requireDeposit: z.boolean().optional(),
        duration: z.number().int().positive().optional(),
        categoryId: z.number().optional(),
        locationType: z.enum(["online", "in_person", "at_client", "at_provider"]).optional(),
        address: z.string().optional(),
        images: z.array(z.string()).optional(),
        tags: z.array(z.string()).optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        cancellationPolicy: z.string().optional(),
        availability: z.any().optional(),
        packages: z.any().optional(),
        addons: z.any().optional(),
        allowRecurring: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const service = await db.getServiceById(input.id);
        if (!service || service.providerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        const { id, price, depositAmount, ...rest } = input;
        const data: Record<string, unknown> = { ...rest };
        if (price !== undefined) data.price = price.toFixed(2);
        if (depositAmount !== undefined) data.depositAmount = depositAmount.toFixed(2);
        await db.updateService(id, data as Parameters<typeof db.updateService>[1]);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const service = await db.getServiceById(input.id);
        if (!service || service.providerId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
        await db.deleteService(input.id);
        return { success: true };
      }),
  }),

  // Orders 
  orders: router({
    myOrders: protectedProcedure.query(({ ctx }) => db.getOrdersByBuyer(ctx.user.id)),
    shopOrders: protectedProcedure.query(async ({ ctx }) => {
      const shop = await db.getShopByOwnerId(ctx.user.id);
      if (!shop) return [];
      return db.getOrdersByShop(shop.id);
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        const shop = await db.getShopByOwnerId(ctx.user.id);
        if (order.buyerId !== ctx.user.id && shop?.id !== order.shopId && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        const items = await db.getOrderItems(input.id);
        return { ...order, items };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]),
        trackingNumber: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const order = await db.getOrderById(input.id);
        if (!order) throw new TRPCError({ code: "NOT_FOUND" });
        const shop = await db.getShopByOwnerId(ctx.user.id);
        if (shop?.id !== order.shopId && ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await db.updateOrder(input.id, { status: input.status, trackingNumber: input.trackingNumber });
        await db.createNotification({
          userId: order.buyerId,
          type: "order_update",
          title: `Order #${order.orderNumber} ${input.status}`,
          body: `Your order status has been updated to ${input.status}`,
          data: { orderId: input.id },
        });
        return { success: true };
      }),
    all: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllOrders(input.limit, input.offset)),
  }),

  // Bookings 
  bookings: router({
    myBookings: protectedProcedure.query(({ ctx }) => db.getBookingsByClient(ctx.user.id)),
    providerBookings: protectedProcedure.query(({ ctx }) => db.getBookingsByProvider(ctx.user.id)),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const booking = await db.getBookingById(input.id);
        if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
        if (booking.clientId !== ctx.user.id && booking.providerId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return booking;
      }),
    create: protectedProcedure
      .input(z.object({
        serviceId: z.number(),
        scheduledAt: z.string(),
        packageId: z.string().optional(),
        addons: z.any().optional(),
        notes: z.string().optional(),
        locationType: z.enum(["online", "in_person", "at_client", "at_provider"]).default("in_person"),
        address: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const service = await db.getServiceById(input.serviceId);
        if (!service) throw new TRPCError({ code: "NOT_FOUND" });
        const bookingNumber = "BK-" + nanoid(10).toUpperCase();
        const shop = await db.getShopByOwnerId(service.providerId);
        const commission = calcCommission(Number(service.price), shop?.trialEndsAt);
        await db.createBooking({
          bookingNumber,
          serviceId: input.serviceId,
          clientId: ctx.user.id,
          providerId: service.providerId,
          scheduledAt: new Date(input.scheduledAt),
          duration: service.duration,
          packageId: input.packageId,
          addons: input.addons,
          notes: input.notes,
          locationType: input.locationType,
          address: input.address,
          totalAmount: service.price,
          depositAmount: service.requireDeposit ? (service.depositAmount ?? "0.00") : "0.00",
          commissionAmount: commission.toFixed(2) as unknown as typeof import("../drizzle/schema").bookings.$inferInsert.commissionAmount,
        });
        await db.createNotification({
          userId: service.providerId,
          type: "new_booking",
          title: "New Booking Request",
          body: `You have a new booking for ${service.title}`,
          data: { serviceId: input.serviceId },
        });
        return { success: true, bookingNumber };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["confirmed", "completed", "cancelled", "no_show"]),
        meetingLink: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const booking = await db.getBookingById(input.id);
        if (!booking) throw new TRPCError({ code: "NOT_FOUND" });
        if (booking.providerId !== ctx.user.id && booking.clientId !== ctx.user.id && ctx.user.role !== "admin") {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        await db.updateBooking(input.id, { status: input.status, meetingLink: input.meetingLink });
        const notifyUserId = booking.providerId === ctx.user.id ? booking.clientId : booking.providerId;
        await db.createNotification({
          userId: notifyUserId,
          type: "booking_update",
          title: `Booking #${booking.bookingNumber} ${input.status}`,
          body: `Your booking status has been updated to ${input.status}`,
          data: { bookingId: input.id },
        });
        return { success: true };
      }),
    all: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllBookings(input.limit, input.offset)),
  }),

  // Reviews 
  reviews: router({
    list: publicProcedure
      .input(z.object({
        type: z.enum(["product", "service", "shop"]),
        targetId: z.number(),
      }))
      .query(({ input }) => db.getReviews(input.type, input.targetId)),
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["product", "service", "shop"]),
        targetId: z.number(),
        rating: z.number().int().min(1).max(5),
        title: z.string().max(256).optional(),
        body: z.string().max(2000).optional(),
        images: z.array(z.string()).optional(),
        orderId: z.number().optional(),
        bookingId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getReviewByAuthorAndTarget(ctx.user.id, input.type, input.targetId);
        if (existing) throw new TRPCError({ code: "CONFLICT", message: "You have already reviewed this" });
        await db.createReview({ ...input, authorId: ctx.user.id, isVerifiedPurchase: !!(input.orderId || input.bookingId) });
        return { success: true };
      }),
  }),

  // Messages 
  messages: router({
    conversations: protectedProcedure.query(({ ctx }) => db.getConversationsByUser(ctx.user.id)),
    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const msgs = await db.getMessages(input.conversationId, 50);
        return msgs.reverse();
      }),
    send: protectedProcedure
      .input(z.object({
        recipientId: z.number(),
        body: z.string().min(1).max(5000),
        productId: z.number().optional(),
        serviceId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const conv = await db.getOrCreateConversation(ctx.user.id, input.recipientId, {
          productId: input.productId,
          serviceId: input.serviceId,
        });
        if (!conv) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.sendMessage({ conversationId: conv.id, senderId: ctx.user.id, body: input.body });
        await db.createNotification({
          userId: input.recipientId,
          type: "new_message",
          title: "New Message",
          body: input.body.substring(0, 100),
          data: { conversationId: conv.id },
        });
        return { success: true };
      }),
  }),

  // Notifications 
  notifications: router({
    list: protectedProcedure.query(({ ctx }) => db.getNotifications(ctx.user.id, 20)),
    getUnreadCount: protectedProcedure.query(({ ctx }) =>
      db.getUnreadNotificationCount(ctx.user.id).then((count) => ({ count }))
    ),
    markRead: protectedProcedure.mutation(({ ctx }) => db.markNotificationsRead(ctx.user.id)),
  }),

  // Wishlist 
  wishlist: router({
    list: protectedProcedure.query(({ ctx }) => db.getWishlist(ctx.user.id)),
    add: protectedProcedure
      .input(z.object({ productId: z.number().optional(), serviceId: z.number().optional() }))
      .mutation(({ ctx, input }) => db.addToWishlist(ctx.user.id, input.productId, input.serviceId)),
    remove: protectedProcedure
      .input(z.object({ productId: z.number().optional(), serviceId: z.number().optional() }))
      .mutation(({ ctx, input }) => db.removeFromWishlist(ctx.user.id, input.productId, input.serviceId)),
    check: protectedProcedure
      .input(z.object({ productId: z.number().optional(), serviceId: z.number().optional() }))
      .query(({ ctx, input }) => db.isInWishlist(ctx.user.id, input.productId, input.serviceId)),
  }),

  // Coupons 
  coupons: router({
    validate: protectedProcedure
      .input(z.object({ code: z.string(), amount: z.number() }))
      .mutation(async ({ input }) => {
        const coupon = await db.getCouponByCode(input.code);
        if (!coupon) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid coupon code" });
        if (coupon.expiresAt && new Date() > coupon.expiresAt) throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon has expired" });
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) throw new TRPCError({ code: "BAD_REQUEST", message: "Coupon usage limit reached" });
        if (coupon.minOrderAmount && input.amount < Number(coupon.minOrderAmount)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Minimum order amount is ${coupon.minOrderAmount}` });
        }
        const discount = coupon.type === "percentage"
          ? (input.amount * Number(coupon.value)) / 100
          : Number(coupon.value);
        return { valid: true, discount: Math.min(discount, input.amount), coupon };
      }),
    create: protectedProcedure
      .input(z.object({
        code: z.string().min(3).max(64),
        type: z.enum(["percentage", "fixed"]),
        value: z.number().positive(),
        minOrderAmount: z.number().positive().optional(),
        maxUses: z.number().int().positive().optional(),
        expiresAt: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopByOwnerId(ctx.user.id);
        if (!shop) throw new TRPCError({ code: "NOT_FOUND" });
        const db2 = await db.getDb();
        if (!db2) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { coupons: couponsTable } = await import("../drizzle/schema");
        await db2.insert(couponsTable).values({
          shopId: shop.id,
          code: input.code.toUpperCase(),
          type: input.type,
          value: input.value.toFixed(2) as unknown as typeof couponsTable.$inferInsert.value,
          minOrderAmount: input.minOrderAmount?.toFixed(2) as unknown as typeof couponsTable.$inferInsert.minOrderAmount,
          maxUses: input.maxUses,
          expiresAt: input.expiresAt ? new Date(input.expiresAt) : undefined,
        });
        return { success: true };
      }),
  }),

  // Addresses 
  addresses: router({
    list: protectedProcedure.query(({ ctx }) => db.getAddresses(ctx.user.id)),
    create: protectedProcedure
      .input(z.object({
        label: z.string().default("Home"),
        fullName: z.string().min(2),
        line1: z.string().min(2),
        line2: z.string().optional(),
        city: z.string().min(2),
        state: z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().min(2),
        phone: z.string().optional(),
        isDefault: z.boolean().default(false),
      }))
      .mutation(({ ctx, input }) => db.createAddress({ ...input, userId: ctx.user.id })),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        label: z.string().optional(),
        fullName: z.string().optional(),
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postcode: z.string().optional(),
        country: z.string().optional(),
        phone: z.string().optional(),
        isDefault: z.boolean().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return db.updateAddress(id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => db.deleteAddress(input.id)),
  }),

  // Reports 
  reports: router({
    create: protectedProcedure
      .input(z.object({
        type: z.enum(["product", "service", "shop", "user", "review", "message"]),
        targetId: z.number(),
        reason: z.string().min(5).max(128),
        details: z.string().max(2000).optional(),
      }))
      .mutation(({ ctx, input }) => db.createReport({ ...input, reporterId: ctx.user.id })),
    list: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllReports(input.limit, input.offset)),
  }),

  // Promotions 
  promotions: router({
    list: publicProcedure
      .input(z.object({ type: z.string().optional() }))
      .query(({ input }) => db.getActivePromotions(input.type)),
  }),

  // Admin 
  admin: router({
    stats: adminProcedure.query(() => db.getAdminStats()),
    users: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllUsers(input.limit, input.offset)),
    shops: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ input }) => db.getAllShops(input.limit, input.offset)),
    verifyShop: adminProcedure
      .input(z.object({ shopId: z.number(), isVerified: z.boolean() }))
      .mutation(({ input }) => db.updateShop(input.shopId, { isVerified: input.isVerified })),
    updateShopStatus: adminProcedure
      .input(z.object({ shopId: z.number(), status: z.enum(["pending", "active", "suspended"]) }))
      .mutation(({ input }) => db.updateShop(input.shopId, { status: input.status })),
    getPlatformSetting: adminProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => db.getPlatformSetting(input.key)),
    setPlatformSetting: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(({ input }) => db.setPlatformSetting(input.key, input.value)),
  }),

  // Payments (Stripe)
  payments: router({
    // Real Stripe Checkout Session for product orders
    createOrderCheckout: protectedProcedure
      .input(z.object({
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number().int().positive(),
          variation: z.any().optional(),
        })),
        shopId: z.number(),
        shippingAddress: z.any().optional(),
        couponCode: z.string().optional(),
        origin: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { stripe, PLATFORM_FEE_PERCENT, CHARITY_FEE_PERCENT } = await import("./stripe");
        if (!stripe) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Payments not configured. Please add Stripe keys in Settings." });
        let subtotal = 0;
        const lineItems: Array<{ price_data: { currency: string; product_data: { name: string; images?: string[] }; unit_amount: number }; quantity: number }> = [];
        const orderItemsData: Array<{ productId: number; title: string; price: number; quantity: number; image?: string; variation?: unknown }> = [];
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product || !product.isActive) throw new TRPCError({ code: "NOT_FOUND", message: `Product ${item.productId} not found` });
          const price = Number(product.price);
          subtotal += price * item.quantity;
          const images = product.images as string[] | null;
          lineItems.push({
            price_data: { currency: "gbp", product_data: { name: product.title, ...(images?.[0] ? { images: [images[0]] } : {}) }, unit_amount: Math.round(price * 100) },
            quantity: item.quantity,
          });
          orderItemsData.push({ productId: item.productId, title: product.title, price, quantity: item.quantity, image: images?.[0], variation: item.variation });
        }
        let discount = 0;
        if (input.couponCode) {
          const coupon = await db.getCouponByCode(input.couponCode);
          if (coupon) {
            discount = coupon.type === "percentage" ? (subtotal * Number(coupon.value)) / 100 : Number(coupon.value);
            await db.useCoupon(coupon.id);
          }
        }
        const total = Math.max(0.50, subtotal - discount);
        const platformFeePence = Math.round(total * PLATFORM_FEE_PERCENT / 100 * 100);
        const charityFeePence = Math.round(total * CHARITY_FEE_PERCENT / 100 * 100);
        const orderNumber = "ORD-" + nanoid(10).toUpperCase();
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: lineItems,
          mode: "payment",
          customer_email: ctx.user.email ?? undefined,
          allow_promotion_codes: true,
          client_reference_id: ctx.user.id.toString(),
          metadata: {
            type: "product_order",
            user_id: ctx.user.id.toString(),
            order_number: orderNumber,
            shop_id: input.shopId.toString(),
            platform_fee_pence: platformFeePence.toString(),
            charity_fee_pence: charityFeePence.toString(),
          },
          success_url: `${input.origin}/orders?success=1&order=${orderNumber}`,
          cancel_url: `${input.origin}/cart?cancelled=1`,
        });
        // Pre-create order as pending; webhook will mark it paid
        const shop = await db.getShopById(input.shopId);
        const commission = calcCommission(total, shop?.trialEndsAt);
        await db.createOrder(
          { orderNumber, buyerId: ctx.user.id, shopId: input.shopId, subtotal: subtotal.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.subtotal, discountAmount: discount.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.discountAmount, commissionAmount: commission.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.commissionAmount, total: total.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.total, couponCode: input.couponCode, shippingAddress: input.shippingAddress, status: "pending" },
          orderItemsData.map((item) => ({ orderId: 0, productId: item.productId, title: item.title, price: item.price.toFixed(2) as unknown as typeof import("../drizzle/schema").orderItems.$inferInsert.price, quantity: item.quantity, image: item.image, variation: item.variation }))
        );
        return { checkoutUrl: session.url, orderNumber, subtotal, discount, total };
      }),
    // Real Stripe Checkout Session for booking deposits
    createBookingCheckout: protectedProcedure
      .input(z.object({ bookingId: z.number(), origin: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { stripe } = await import("./stripe");
        if (!stripe) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Payments not configured" });
        const dbInst = await import("./db").then(m => m.getDb());
        if (!dbInst) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB not available" });
        const { bookings: bookingsTable, services: servicesTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const [booking] = await dbInst.select().from(bookingsTable).where(eq(bookingsTable.id, input.bookingId)).limit(1);
        if (!booking || booking.clientId !== ctx.user.id) throw new TRPCError({ code: "NOT_FOUND" });
        const [service] = await dbInst.select().from(servicesTable).where(eq(servicesTable.id, booking.serviceId)).limit(1);
        const depositPence = Math.max(50, Math.round(Number(booking.depositAmount) * 100));
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{ price_data: { currency: "gbp", product_data: { name: `Deposit: ${service?.title ?? "Service Booking"}` }, unit_amount: depositPence }, quantity: 1 }],
          mode: "payment",
          customer_email: ctx.user.email ?? undefined,
          client_reference_id: ctx.user.id.toString(),
          metadata: { type: "booking_deposit", booking_id: input.bookingId.toString(), user_id: ctx.user.id.toString() },
          success_url: `${input.origin}/bookings?success=1&booking=${booking.bookingNumber}`,
          cancel_url: `${input.origin}/bookings?cancelled=1`,
        });
        return { checkoutUrl: session.url };
      }),
    confirmOrder: protectedProcedure
      .input(z.object({
        orderNumber: z.string(),
        shopId: z.number(),
        subtotal: z.number(),
        discount: z.number(),
        total: z.number(),
        shippingAddress: z.any().optional(),
        couponCode: z.string().optional(),
        items: z.array(z.object({
          productId: z.number(),
          title: z.string(),
          price: z.number(),
          quantity: z.number(),
          image: z.string().optional(),
          variation: z.any().optional(),
        })),
        stripePaymentIntentId: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const shop = await db.getShopById(input.shopId);
        const commission = calcCommission(input.total, shop?.trialEndsAt);

        await db.createOrder(
          {
            orderNumber: input.orderNumber,
            buyerId: ctx.user.id,
            shopId: input.shopId,
            subtotal: input.subtotal.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.subtotal,
            discountAmount: input.discount.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.discountAmount,
            commissionAmount: commission.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.commissionAmount,
            total: input.total.toFixed(2) as unknown as typeof import("../drizzle/schema").orders.$inferInsert.total,
            couponCode: input.couponCode,
            shippingAddress: input.shippingAddress,
            stripePaymentIntentId: input.stripePaymentIntentId,
            status: "confirmed",
            paidAt: new Date(),
          },
          input.items.map((item) => ({
            orderId: 0, // Will be set by DB
            productId: item.productId,
            title: item.title,
            price: item.price.toFixed(2) as unknown as typeof import("../drizzle/schema").orderItems.$inferInsert.price,
            quantity: item.quantity,
            image: item.image,
            variation: item.variation,
          }))
        );

        // Notify seller
        if (shop) {
          await db.createNotification({
            userId: shop.ownerId,
            type: "new_order",
            title: "New Order Received!",
            body: `Order #${input.orderNumber} for ${input.total.toFixed(2)}`,
            data: { orderNumber: input.orderNumber },
          });
        }

        return { success: true, orderNumber: input.orderNumber };
      }),
  }),
  // Product Importer (AI-powered URL scraper)
  importer: router({
    importFromUrl: protectedProcedure
      .input(z.object({ url: z.string().url() }))
      .mutation(async ({ input }) => {
        // Fetch the webpage HTML
        let html = "";
        try {
          const res = await fetch(input.url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; NoorMarketplace/1.0; +https://noormarketplace.com)" },
            signal: AbortSignal.timeout(10000),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          html = await res.text();
        } catch (err) {
          throw new TRPCError({ code: "BAD_REQUEST", message: `Could not fetch URL: ${(err as Error).message}` });
        }

        // Strip scripts/styles and truncate to ~8000 chars for LLM
        const cleaned = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 8000);

        // Extract og:image from HTML
        const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
          || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
        const ogImage = ogImageMatch?.[1] ?? null;

        // Use LLM to extract product data
        const { invokeLLM } = await import("./_core/llm");
        let extracted: { title: string; description: string; price: number | null; currency: string; images: string[] } = {
          title: "", description: "", price: null, currency: "GBP", images: []
        };
        try {
          const result = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are a product data extractor. Extract product information from webpage text and return valid JSON only. Be concise.",
              },
              {
                role: "user",
                content: `Extract product information from this webpage text. Return a JSON object with:\n- title: product name (string)\n- description: product description max 500 chars (string)\n- price: price as number or null\n- currency: currency code like GBP, USD, EUR (string)\n- images: array of image URLs found in the text (array of strings, max 5)\n\nWebpage text:\n${cleaned}`,
              },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "product_data",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    price: { type: ["number", "null"] },
                    currency: { type: "string" },
                    images: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "description", "price", "currency", "images"],
                  additionalProperties: false,
                },
              },
            },
          });
          const content = result.choices?.[0]?.message?.content;
          if (content) {
            extracted = typeof content === "string" ? JSON.parse(content) : (content as unknown as typeof extracted);
          }
        } catch (err) {
          console.error("[Importer] LLM extraction failed:", err);
          // Fall back to basic extraction from HTML
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
          extracted.title = titleMatch?.[1]?.trim() ?? "Imported Product";
        }

        // Add og:image if not already in images
        if (ogImage && !extracted.images.includes(ogImage)) {
          extracted.images.unshift(ogImage);
        }

        return {
          title: extracted.title || "Imported Product",
          description: extracted.description || "",
          price: extracted.price,
          currency: extracted.currency || "GBP",
          images: extracted.images.slice(0, 5),
          sourceUrl: input.url,
        };
      }),
  }),

  // Upload 
  upload: router({
    image: protectedProcedure
      .input(z.object({
        base64: z.string(),
        mimeType: z.string().default("image/jpeg"),
        filename: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const ext = input.mimeType.split("/")[1] ?? "jpg";
        const filename = input.filename ?? `img-${Date.now()}.${ext}`;
        const key = `uploads/${ctx.user.id}/${Date.now()}-${filename}`;
        const buffer = Buffer.from(input.base64, "base64");
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url };
      }),
  }),
});
export type AppRouter = typeof appRouter;
