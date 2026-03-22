# Noor Marketplace — The Islamic Marketplace for the Global Ummah

A full-stack, production-ready Islamic e-commerce marketplace connecting Muslim buyers and sellers worldwide, with built-in Sadaqah (charity) on every transaction.

---

## Overview

Noor Marketplace is a complete, investor-ready platform that enables Muslim entrepreneurs to sell halal products and services to a global audience. Every transaction automatically donates **0.5% to Islamic charities** — making commerce an act of worship.

| Feature | Details |
|---|---|
| **Commission Model** | 7% total (6.5% platform + 0.5% Sadaqah charity) |
| **Charity Mechanism** | Auto-donated on every order via Stripe |
| **Authentication** | Email/password (bcrypt + JWT) — fully custom, no third-party OAuth |
| **Payments** | Stripe Checkout (products + service deposits) |
| **AI Product Import** | Scrape any URL and auto-populate products with images |
| **Admin Access** | Locked to designated admin email only (triple-layer security) |

---

## Key Features

### For Buyers
- Browse halal products and Islamic services
- Full cart, checkout, and order tracking with visual status timeline
- Wishlist, coupon codes, and verified purchase reviews
- Real-time notification centre
- See exactly how much charity was donated from each order

### For Sellers
- Create a branded shop with logo, banner, and description
- **Import products from any URL** — AI scrapes title, description, price, and images automatically
- Manage products, services, orders, and bookings from one dashboard
- Real-time revenue analytics: gross sales, net earnings, charity contributed
- Coupon creation and promotional tools
- Public shop profile page at /shop/:slug

### For Administrators (restricted access)
- Full platform analytics: GMV, platform revenue, charity donated
- User and shop management with verification controls
- Order oversight with charity breakdown per transaction
- Dedicated charity impact dashboard

---

## Commission Model

Every sale on Noor Marketplace carries a **7% total commission**:

    Sale Price: 100.00
    Seller receives:  93.00 (93%)
    Platform fee:      6.50 (6.5%)
    Charity (Sadaqah): 0.50 (0.5%)

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, TailwindCSS v4, Framer Motion |
| **Backend** | Node.js, Express, tRPC (fully type-safe API) |
| **Database** | MySQL / TiDB (Drizzle ORM) |
| **Auth** | Custom email/password (bcrypt + JWT HTTP-only cookies) |
| **Payments** | Stripe Checkout + Webhooks |
| **AI Import** | OpenAI GPT-4 (product scraping from any URL) |

---

## Getting Started

```bash
git clone https://github.com/tahbrun1-alt/islamic-marketplace
cd islamic-marketplace
pnpm install
```

Create a .env file with:
- DATABASE_URL
- SESSION_SECRET
- STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET / VITE_STRIPE_PUBLISHABLE_KEY
- OPENAI_API_KEY

Seed admin account:
```bash
node scripts/seed-admin.mjs
```

Run development:
```bash
pnpm run dev
```

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — hero, featured products/services, categories |
| `/products` | Product catalogue with search and filters |
| `/services` | Service catalogue |
| `/products/:id` | Product detail with reviews and add to cart |
| `/services/:id` | Service detail with booking |
| `/shop/:slug` | Public seller shop profile |
| `/sellers` | Browse all verified sellers |
| `/cart` | Shopping cart |
| `/checkout` | Stripe-powered checkout |
| `/orders` | Order history with status timeline and charity breakdown |
| `/bookings` | Service booking history |
| `/wishlist` | Saved items |
| `/notifications` | Real-time notification centre |
| `/profile` | Account management |
| `/seller/dashboard` | Seller analytics, products, orders, settings |
| `/import-product` | AI-powered product import from URL |
| `/admin` | Admin panel (restricted to admin email) |
| `/how-it-works` | Platform guide with charity section |
| `/terms` | Terms of service |

---

## Security

- Admin access is triple-locked: backend API guard, frontend page component, and Navbar links
- All passwords hashed with bcrypt (12 rounds)
- JWT tokens in HTTP-only cookies (XSS-safe)
- All seller mutations verify shop ownership before proceeding
- Stripe webhooks verified with webhook secret

---

## Investor Notes

- **Market**: 1.8 billion Muslims globally, halal economy estimated at $3.2 trillion
- **Differentiation**: Built-in Sadaqah mechanism aligns with Islamic values and creates loyalty
- **Revenue Model**: 7% commission on all transactions, scalable with zero marginal cost
- **Network Effects**: More sellers => more products => more buyers => more charity impact
- **AI Advantage**: URL import tool dramatically lowers seller onboarding friction
- **Trust**: Halal verification, transparent charity tracking, and Islamic branding build deep community trust

---

*Noor (noor) means Light in Arabic — bringing light to Islamic commerce.*
