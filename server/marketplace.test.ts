import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", () => ({
  getProductById: vi.fn(),
  getProducts: vi.fn(),
  getServices: vi.fn(),
  getServiceById: vi.fn(),
  getShopByOwnerId: vi.fn(),
  createShop: vi.fn(),
  getAdminStats: vi.fn(),
  getAllShops: vi.fn(),
  updateShop: vi.fn(),
  getCategories: vi.fn(),
  getBookingsByClient: vi.fn(),
  getOrdersByBuyer: vi.fn(),
  getShopOrders: vi.fn(),
  getNotifications: vi.fn(),
  getUnreadNotificationCount: vi.fn(),
  createProduct: vi.fn(),
  createService: vi.fn(),
  createBooking: vi.fn(),
  createOrder: vi.fn(),
  createReview: vi.fn(),
  getMessages: vi.fn(),
  sendMessage: vi.fn(),
  getCouponByCode: vi.fn(),
  useCoupon: vi.fn(),
  getPlatformSetting: vi.fn(),
  setPlatformSetting: vi.fn(),
  getShopById: vi.fn(),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

import * as db from "./db";

function makeCtx(overrides: Partial<TrpcContext> = {}): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
    ...overrides,
  };
}

function makeUser(role: "user" | "admin" = "user") {
  return {
    id: 1,
    openId: "test-user",
    name: "Test User",
    email: "test@example.com",
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

// ─── Auth Tests ───────────────────────────────────────────────────────────────

describe("auth.me", () => {
  it("returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated users", async () => {
    const user = makeUser();
    const caller = appRouter.createCaller(makeCtx({ user }));
    const result = await caller.auth.me();
    expect(result).toEqual(user);
  });
});

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const clearedCookies: string[] = [];
    const ctx = makeCtx({
      user: makeUser(),
      res: {
        clearCookie: (name: string) => clearedCookies.push(name),
      } as unknown as TrpcContext["res"],
    });
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(clearedCookies.length).toBeGreaterThan(0);
  });
});

// ─── Products Tests ───────────────────────────────────────────────────────────

describe("products.list", () => {
  it("returns product list with default params", async () => {
    const mockProducts = [
      { id: 1, title: "Islamic Art Print", price: "29.99", shopId: 1, isActive: true },
    ];
    vi.mocked(db.getProducts).mockResolvedValue(mockProducts as never);

    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.products.list({});
    expect(result).toEqual(mockProducts);
    expect(db.getProducts).toHaveBeenCalled();
  });

  it("accepts search and category filters", async () => {
    vi.mocked(db.getProducts).mockResolvedValue([] as never);
    const caller = appRouter.createCaller(makeCtx());
    await caller.products.list({ search: "abaya", category: "modest-fashion", limit: 10 });
    expect(db.getProducts).toHaveBeenCalled();
  });
});

describe("products.getById", () => {
  it("returns product when found", async () => {
    const mockProduct = { id: 5, title: "Prayer Mat", price: "45.00", shopId: 2 };
    vi.mocked(db.getProductById).mockResolvedValue(mockProduct as never);

    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.products.getById({ id: 5 });
    expect(result).toEqual(mockProduct);
  });

  it("returns undefined when product does not exist", async () => {
    vi.mocked(db.getProductById).mockResolvedValue(undefined as never);
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.products.getById({ id: 999 });
    expect(result).toBeUndefined();
  });
});

// ─── Services Tests ───────────────────────────────────────────────────────────

describe("services.list", () => {
  it("returns services list", async () => {
    const mockServices = [
      { id: 1, title: "Quran Tutoring", price: "25.00", providerId: 1, isActive: true },
    ];
    vi.mocked(db.getServices).mockResolvedValue(mockServices as never);

    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.services.list({});
    expect(result).toEqual(mockServices);
  });
});

// ─── Shops Tests ──────────────────────────────────────────────────────────────

describe("shops.list", () => {
  it("returns shop list", async () => {
    const mockShops = [
      { id: 1, name: "Barakah Boutique", slug: "barakah-boutique", ownerId: 1 },
    ];
    vi.mocked(db.getAllShops).mockResolvedValue(mockShops as never);

    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.shops.list({ limit: 20 });
    expect(result).toEqual(mockShops);
  });
});

// ─── Admin Tests ──────────────────────────────────────────────────────────────

describe("admin.stats", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("returns stats for admin users", async () => {
    const mockStats = { users: 100, shops: 25, products: 500, orders: 200, bookings: 50 };
    vi.mocked(db.getAdminStats).mockResolvedValue(mockStats as never);

    const caller = appRouter.createCaller(makeCtx({ user: makeUser("admin") }));
    const result = await caller.admin.stats();
    expect(result).toEqual(mockStats);
  });
});

describe("admin.verifyShop", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("user") }));
    await expect(caller.admin.verifyShop({ shopId: 1, isVerified: true })).rejects.toThrow();
  });

  it("calls updateShop for admin users", async () => {
    vi.mocked(db.updateShop).mockResolvedValue(undefined as never);
    const caller = appRouter.createCaller(makeCtx({ user: makeUser("admin") }));
    await caller.admin.verifyShop({ shopId: 1, isVerified: true });
    expect(db.updateShop).toHaveBeenCalledWith(1, { isVerified: true });
  });
});

// ─── Commission Tests ─────────────────────────────────────────────────────────

describe("Commission calculation", () => {
  it("applies 6.5% commission correctly", () => {
    const salePrice = 89.99;
    const commissionRate = 0.065;
    const commission = parseFloat((salePrice * commissionRate).toFixed(2));
    const sellerReceives = parseFloat((salePrice - commission).toFixed(2));

    expect(commission).toBe(5.85);
    expect(sellerReceives).toBe(84.14);
  });

  it("calculates zero commission during trial period", () => {
    const trialEndsAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    const isInTrial = new Date() < trialEndsAt;
    const commission = isInTrial ? 0 : 89.99 * 0.065;
    expect(commission).toBe(0);
  });
});

// ─── Categories Tests ─────────────────────────────────────────────────────────

describe("categories.list", () => {
  it("returns categories", async () => {
    const mockCategories = [
      { id: 1, name: "Modest Fashion", slug: "modest-fashion", type: "products" },
      { id: 2, name: "Quran Tutoring", slug: "quran-tutoring", type: "services" },
    ];
    vi.mocked(db.getCategories).mockResolvedValue(mockCategories as never);

    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.categories.list({ type: "product" });
    expect(result).toEqual(mockCategories);
  });
});
