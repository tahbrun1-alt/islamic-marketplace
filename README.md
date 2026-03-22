# Noor Marketplace — Islamic Products & Services Platform

A full-featured, production-ready marketplace for halal products and Islamic services. Built with React, Express, tRPC, Tailwind CSS, and PostgreSQL.

**Live Demo:** [https://noor-marketplace.manus.space](https://noor-marketplace.manus.space)  
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
- **Auth:** NextAuth v5 (Google OAuth + email magic link)
- **Payments:** Stripe (products + service deposits)
- **Storage:** AWS S3 (images, files)
- **Email:** Resend (transactional emails)
- **Deployment:** Manus (built-in hosting with custom domains)

---

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Stripe account (for payments)
- Google OAuth credentials (for auth)

### Installation

```bash
# Clone the repository
gh repo clone tahbrun1-alt/islamic-marketplace
cd islamic-marketplace

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Generate Prisma client (if using Prisma)
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/noor_marketplace

# Auth (Manus OAuth)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
JWT_SECRET=your-jwt-secret-key

# Stripe
NEXT_PUBLIC_STRIPE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=noor-marketplace
AWS_REGION=us-east-1

# Email (Resend)
RESEND_API_KEY=re_...

# Google OAuth (for NextAuth)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# App Config
NEXT_PUBLIC_APP_URL=https://noor-marketplace.com
OWNER_NAME=Noor Marketplace
OWNER_OPEN_ID=owner-id
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

### Manus (Recommended)
The project is pre-configured for Manus hosting:

1. Push to GitHub: `git push origin main`
2. In Manus UI, click **Publish**
3. Custom domain setup available in Settings → Domains

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
pnpm prisma generate
```

### Database connection failed
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Run migrations: `pnpm prisma migrate dev`

### Stripe payments not working
- Verify `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_KEY`
- Check Stripe webhook is configured
- Test with Stripe test cards

### Auth not working
- Verify `VITE_APP_ID` and OAuth credentials
- Check callback URL matches OAuth provider settings
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

**Ready to launch?** Deploy to Manus with one click, or self-host with Docker. Full documentation available at [docs.noormarketplace.com](https://docs.noormarketplace.com).
