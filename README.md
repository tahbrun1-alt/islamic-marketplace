# Noor Marketplace — Islamic Products & Services Platform

A full-featured, production-ready marketplace for halal products and Islamic services. Built with React, Express, tRPC, Tailwind CSS, and PostgreSQL.

**GitHub:** [tahbrun1-alt/islamic-marketplace](https://github.com/tahbrun1-alt/islamic-marketplace)

---

## Features

### For Buyers
- **Browse Products & Services** — Search, filter by category, price, gender, and ratings
- **Smart Cart** — Add items, manage quantities, apply coupon codes
- **Secure Checkout** — Stripe payments with order tracking
- **Wishlist** — Save favourite products and services for later
- **Reviews & Ratings** — Leave verified purchase reviews
- **Order History** — Track all past purchases and bookings
- **Service Booking** — Calendar-based booking with deposits and availability

### For Sellers
- **Seller Dashboard** — Manage products, services, orders, and bookings
- **Product Management** — Create, edit, delete products with images and descriptions
- **Service Management** — Offer services with booking system, deposits, and availability
- **AI Product Importer** — Paste a website URL and auto-import products (titles, descriptions, prices, images)
- **Order Management** — View orders, track shipments, manage commissions
- **Shop Profile** — Customize your shop, set commission rates, halal certification
- **Analytics** — View sales, revenue, and customer insights

### For Admins
- **Admin Panel** — User management, shop verification, analytics
- **Commission Model** — 6.5% commission with 14-day free trial
- **Moderation** — Verify shops, manage listings, handle disputes
- **Notifications** — Real-time alerts for new orders and activities

### Platform Features
- **Halal Certification** — Verify and badge halal-certified shops
- **Multi-Vendor Support** — Multiple sellers on one platform
- **Coupon Codes** — Create percentage or fixed-amount discounts
- **Messaging** — Direct communication between buyers and sellers
- **PWA Ready** — Install as app on iOS/Android
- **SEO Optimized** — Meta tags, structured data, sitemap
- **Responsive Design** — Mobile-first, elegant white/cream/gold UI

---

## Tech Stack

- **Frontend:** React 19, Tailwind CSS 4, Framer Motion, shadcn/ui
- **Backend:** Express 4, tRPC 11, Node.js
- **Database:** PostgreSQL with Drizzle ORM
- **Auth:** Standalone JWT with bcrypt (no OAuth dependency)
- **Payments:** Stripe Checkout Sessions + Webhooks
- **Storage:** Cloudinary (free tier image uploads)
- **Fonts:** Cormorant Garamond + Inter (Google Fonts)

---

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8+ or TiDB (or any MySQL-compatible database)
- Stripe account (for payments)
- Cloudinary account (free tier, for image uploads)

### Installation

```bash
# Clone the repository
git clone https://github.com/tahbrun1-alt/islamic-marketplace.git
cd islamic-marketplace

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file with the following:

```env
# Database (MySQL / TiDB)
DATABASE_URL=mysql://user:password@localhost:3306/noor_marketplace

# Auth (standalone JWT — no OAuth required)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Cloudinary (image uploads — optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## Project Structure

```
islamic-marketplace/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── stores/           # Zustand state (cart)
│   │   ├── lib/              # tRPC client, utilities
│   │   ├── App.tsx           # Routes
│   │   └── index.css         # Global styles (white/cream/gold)
│   ├── public/               # Static assets, PWA manifest
│   └── index.html            # HTML entry with SEO meta tags
├── server/                    # Express backend
│   ├── db.ts                 # Database queries
│   ├── routers.ts            # tRPC procedures
│   ├── storage.ts            # S3 upload helpers
│   └── _core/                # Auth, OAuth, context
├── drizzle/                   # Database schema & migrations
├── prisma/                    # Prisma schema (if using)
├── package.json              # Dependencies
├── tailwind.config.ts        # Tailwind config (cream/gold palette)
└── README.md                 # This file
```

---

## Key Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage with Products/Services toggle |
| `/products` | Product listing with search & filters |
| `/products/:id` | Product detail page |
| `/services` | Service listing with booking |
| `/services/:id` | Service detail & booking form |
| `/cart` | Shopping cart |
| `/checkout` | Secure checkout with coupon codes |
| `/orders` | Order history & tracking |
| `/bookings` | Service booking history |
| `/wishlist` | Saved products & services |
| `/sellers` | Seller directory |
| `/sellers/:id` | Public shop page |
| `/seller/dashboard` | Seller dashboard (products, services, orders) |
| `/admin` | Admin panel (stats, user management) |
| `/profile` | User profile & settings |
| `/how-it-works` | Platform guide |
| `/terms` | Terms & conditions |

---

## Database Schema

### Core Tables
- **users** — User accounts, roles (admin/user)
- **shops** — Seller profiles, commission rates
- **products** — Product listings with images, pricing
- **services** — Service offerings with booking
- **orders** — Product orders with items
- **bookings** — Service bookings with deposits
- **reviews** — Product & service reviews
- **wishlist** — Saved items
- **coupons** — Discount codes
- **messages** — Buyer-seller messaging
- **notifications** — System & user notifications

See `drizzle/schema.ts` for full schema.

---

## API Routes (tRPC)

All API calls use tRPC. Key routers:

- `products.list` — Get products with filters
- `products.create` — Create product (seller only)
- `products.update` — Update product (seller only)
- `services.list` — Get services
- `services.book` — Book a service
- `orders.create` — Create order
- `wishlist.add` / `.remove` — Manage wishlist
- `coupons.validate` — Validate coupon code
- `auth.me` — Get current user
- `admin.getStats` — Admin dashboard stats

---

## Commission Model

- **Standard Rate:** 6.5% per order
- **Free Trial:** 14 days (0% commission)
- **Minimum Order:** £5
- **Payment Cycle:** Weekly payouts to seller bank account

---

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/marketplace.test.ts
```

17 tests included covering auth, products, services, orders, and wishlist.

---

## Building for Production

```bash
# Build frontend & backend
pnpm build

# Start production server
pnpm start
```

---

## Deployment

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

### Other Platforms (Vercel, Railway, etc.)
Update `package.json` scripts and environment variables as needed.

---

## Features Roadmap

- [ ] Live chat with sellers
- [ ] Seller analytics dashboard
- [ ] Subscription products
- [ ] Gift cards
- [ ] Affiliate program
- [ ] Multi-currency support
- [ ] Advanced search (AI-powered)
- [ ] Video product reviews

---

## Troubleshooting

### "Cannot find module" errors
```bash
pnpm install
```

### Database connection failed
- Check `DATABASE_URL` in your environment
- Ensure MySQL/TiDB is running

### Stripe payments not working
- Verify `STRIPE_SECRET_KEY` and `VITE_STRIPE_PUBLISHABLE_KEY`
- Check Stripe webhook is configured at `/api/stripe/webhook`
- Test with Stripe test card: `4242 4242 4242 4242`

### Image uploads not working
- Verify Cloudinary credentials
- Without Cloudinary, a placeholder image is used (app still works)

### Auth not working
- Verify `JWT_SECRET` is set
- Clear browser cookies and try again

---

## Support & Contributing

- **Issues:** [GitHub Issues](https://github.com/tahbrun1-alt/islamic-marketplace/issues)
- **Discussions:** [GitHub Discussions](https://github.com/tahbrun1-alt/islamic-marketplace/discussions)
- **Email:** support@noormarketplace.com

---

## License

MIT License — See LICENSE file for details.

---

## Acknowledgments

Built with ❤️ for the Muslim community. Designed to be halal-first, accessible, and beautiful.

**Noor** (نور) means *Light* in Arabic — bringing light to Islamic commerce.

---

**Noor** (نور) means *Light* in Arabic — bringing light to Islamic commerce.
