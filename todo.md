# Noor Marketplace - Project TODO

## Phase 1: Foundation & Schema
- [x] Database schema: users, shops, products, services, categories, orders, bookings, reviews, messages, notifications, coupons, payouts
- [x] Install Stripe, Splide, GSAP, date-fns, react-big-calendar dependencies
- [x] Global CSS theming (Islamic color palette: emerald/gold/cream)
- [x] App.tsx routing structure

## Phase 2: Homepage & Core Layout
- [x] Animated hero section with Framer Motion
- [x] Navigation bar (Products / Services split)
- [x] Islamic branding (Noor Marketplace, Arabic calligraphy elements)
- [x] Featured categories grid (Products + Services)
- [x] Trending products section
- [x] Featured sellers section
- [x] Seasonal promotions (Ramadan, Eid)
- [x] Footer with links

## Phase 3: Authentication & Profiles
- [x] User profile page (buyer)
- [x] Seller shop creation flow
- [x] Order history page
- [x] Booking history page
- [x] Auth integration (Manus OAuth)

## Phase 4: Products Section
- [x] Product listing page with filters/search
- [x] Product detail page
- [x] Shopping cart
- [x] Checkout flow
- [x] Orders page
- [x] Cart state management (Zustand)

## Phase 5: Seller Dashboard (Products)
- [x] Seller dashboard overview
- [x] Create/edit product listings
- [x] Order management
- [x] Shop profile setup

## Phase 6: Services Section
- [x] Service listing page with filters/search
- [x] Service detail page
- [x] Booking flow with date/time selection
- [x] Deposit/full payment options
- [x] Bookings page

## Phase 7: Service Provider Dashboard
- [x] Provider dashboard overview (combined with seller dashboard)
- [x] Create/edit service listings
- [x] Booking management

## Phase 8: Messaging & Notifications
- [x] tRPC routers for messages and notifications
- [x] In-app notifications (via tRPC)

## Phase 9: Admin Panel
- [x] Admin dashboard overview with stats
- [x] User management
- [x] Seller/provider shop verification
- [x] Listings moderation
- [x] Commission settings (6.5% after 14-day free trial)
- [x] Admin role-based access control

## Phase 10: Islamic-Specific Features
- [x] Halal certification badges
- [x] Islamic branding and color palette
- [x] Sellers directory page
- [x] How It Works page

## Phase 11: Payments & Commission
- [x] Checkout flow with order creation
- [x] 14-day free trial logic (no commission)
- [x] 6.5% commission extraction after trial
- [x] Coupon/discount code support in routers

## Phase 12: Documentation & Legal
- [x] Terms & Conditions page
- [x] How It Works / Commission page

## Phase 13: Testing & GitHub
- [x] 17 vitest unit tests passing
- [x] Zero TypeScript errors
- [x] Push to GitHub repository

## Change Request: UI Redesign & Fixes
- [ ] Overhaul colour palette to white/cream/gold (elegant, professional)
- [ ] Redesign homepage with Products/Services toggle section
- [ ] Fix View Shop button on Sellers page (broken routing)
- [ ] Update Navbar to match new colour scheme
- [ ] Update Footer to match new colour scheme

## Full Standalone Rebuild
- [ ] Bootstrap Next.js 14 standalone project (no Manus deps)
- [ ] Prisma schema + PostgreSQL (Neon/Supabase compatible)
- [ ] NextAuth (Google OAuth + email magic link)
- [ ] White/cream/gold UI redesign
- [ ] Homepage Products/Services toggle
- [ ] Fix View Shop button routing
- [ ] Products: listings, detail, cart, Stripe checkout
- [ ] Services: listings, detail, booking, Stripe deposit
- [ ] Seller Dashboard with AI product importer (URL scraper)
- [ ] Admin Panel, messaging, reviews, wishlist, coupons
- [ ] Cloudinary image uploads
- [ ] Resend transactional emails
- [ ] PWA manifest + SEO + sitemap
- [ ] Comprehensive README + deployment docs
- [ ] Push complete standalone codebase to GitHub

## Bug Fixes (Active Webdev Project)
- [x] Fix product editing — add working create/edit form in seller dashboard
- [x] Fix View Shop button routing on sellers page
