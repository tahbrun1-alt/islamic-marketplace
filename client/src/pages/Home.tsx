import { useState } from "react";
import NearMeDiscovery from "@/components/NearMeDiscovery";
import SmartBundles from "@/components/SmartBundles";
import { NewSellerSpotlight } from "@/components/SellerBoost";
import { CommunityReviews } from "@/components/CommunityLayer";
import IslamicGiftingSystem from "@/components/IslamicGiftingSystem";
import { CharityImpactSection } from "@/components/CharityIntegration";
import { TrustBadgesSection } from "@/components/IslamicTrustBadges";
import { SeasonalBanner } from "@/components/SeasonalEngine";
import { WhatsAppSupport } from "@/components/WhatsAppFallback";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag, Calendar, Star, ArrowRight, Shield, Truck,
  Award, Users, Package, ChevronRight, Heart, MapPin,
  CheckCircle, Store, Clock, Shirt, Circle, BookOpen,
  Home, Utensils, Gem, Camera, Leaf, Handshake, Languages,
  Activity, Gift, Moon, GraduationCap, Ring, Scissors, LucideIcon
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PRODUCT_CATEGORIES: { name: string; Icon: LucideIcon; href: string }[] = [
  { name: "Modest Fashion", Icon: Shirt,     href: "/products?category=modest-fashion" },
  { name: "Prayer Items",   Icon: Circle,    href: "/products?category=prayer-items" },
  { name: "Islamic Books",  Icon: BookOpen,  href: "/products?category=qurans-books" },
  { name: "Home & Decor",   Icon: Home,      href: "/products?category=gifts-decor" },
  { name: "Halal Food",     Icon: Utensils,  href: "/products?category=halal-food" },
  { name: "Jewellery",      Icon: Gem,       href: "/products?category=jewellery" },
  { name: "Abayas",         Icon: Shirt,     href: "/products?category=abayas-jilbabs" },
  { name: "Ramadan & Eid",  Icon: Moon,      href: "/products?category=ramadan-eid" },
];

const SERVICE_CATEGORIES: { name: string; Icon: LucideIcon; href: string }[] = [
  { name: "Quran Tutoring",  Icon: GraduationCap, href: "/services?category=quran-tutoring" },
  { name: "Nikah Services",  Icon: Ring,          href: "/services?category=nikah-services" },
  { name: "Halal Catering",  Icon: Utensils,      href: "/services?category=halal-catering" },
  { name: "Photography",     Icon: Camera,        href: "/services?category=photography" },
  { name: "Henna & Beauty",  Icon: Leaf,          href: "/services?category=henna-beauty" },
  { name: "Islamic Counsel", Icon: Handshake,     href: "/services?category=islamic-counselling" },
  { name: "Arabic Lessons",  Icon: Languages,     href: "/services?category=arabic-lessons" },
  { name: "Hijama Therapy",  Icon: Activity,      href: "/services?category=hijama-therapy" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-primary text-primary" : "text-border"}`} />
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Home() {
  const { isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"products" | "services">("products");

  const { data: featuredProducts } = trpc.products.list.useQuery({
    isFeatured: true, limit: 8
  });
  const { data: featuredServices } = trpc.services.list.useQuery({
    isFeatured: true, limit: 8
  });
  const { data: allProducts } = trpc.products.list.useQuery({ limit: 4 });
  const { data: allServices } = trpc.services.list.useQuery({ limit: 4 });

  const displayProducts = (featuredProducts?.length ? featuredProducts : allProducts) ?? [];
  const displayServices = (featuredServices?.length ? featuredServices : allServices) ?? [];

  return (
    <div className="min-h-screen bg-background">
      {/* ── Seasonal Banner ──────────────────────────────────────────────── */}
      <SeasonalBanner />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pattern-bg">
        {/* Decorative gold lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.58 0.13 75 / 0.4), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, oklch(0.58 0.13 75 / 0.3), transparent)" }} />
        </div>

        <div className="container py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            {/* Arabic greeting */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="font-arabic text-2xl text-primary block mb-3">السلام عليكم</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-5xl lg:text-6xl font-semibold text-foreground mb-5 leading-tight"
            >
              The Islamic{" "}
              <span className="gradient-text">Marketplace</span>
              <br />for the Global Ummah
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed"
            >
              Discover halal products and trusted services from verified Muslim sellers worldwide.
              Shop with confidence, sell with ease.
            </motion.p>

            {/* Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center p-1 rounded-xl mb-8"
              style={{ background: "oklch(0.78 0.18 85 / 0.07)", border: "1px solid oklch(0.92 0.018 86)" }}
            >
              <button
                onClick={() => setMode("products")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === "products"
                    ? "text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={mode === "products" ? { background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" } : {}}
              >
                <ShoppingBag className="w-4 h-4" />
                Shop Products
              </button>
              <button
                onClick={() => setMode("services")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  mode === "services"
                    ? "text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                style={mode === "services" ? { background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" } : {}}
              >
                <Calendar className="w-4 h-4" />
                Book Services
              </button>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Button size="lg" className="h-12 px-8 rounded-xl text-primary-foreground font-medium shadow-sm hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }} asChild>
                <Link href={mode === "products" ? "/products" : "/services"}>
                  {mode === "products" ? "Browse Products" : "Browse Services"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              {!isAuthenticated && (
                <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl font-medium border-border hover:bg-secondary" asChild>
                  <a href={getLoginUrl()}>Start Selling Free</a>
                </Button>
              )}
            </motion.div>

            {/* Trust stats */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8"
              style={{ borderTop: "1px solid oklch(0.92 0.018 86)" }}
            >
              {[
                { value: "Halal", label: "Verified Products" },
                { value: "Trusted", label: "Seller Community" },
                { value: "UK & Global", label: "Delivery" },
                { value: "Free", label: "To Start Selling" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif font-semibold text-xl text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Gold divider ─────────────────────────────────────────────────── */}
      <div className="divider-gold" />

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.section
          key={mode}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="py-14 bg-background"
        >
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {mode === "products" ? "Shop by Category" : "Browse by Service"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "products" ? "Halal-certified products across all categories" : "Trusted Islamic service providers"}
                </p>
              </div>
              <Link href={mode === "products" ? "/products" : "/services"}
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {(mode === "products" ? PRODUCT_CATEGORIES : SERVICE_CATEGORIES).map((cat, i) => (
                <motion.div key={cat.name}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}>
                  <Link href={cat.href}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-secondary transition-all duration-200 group text-center">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                      style={{ background: "oklch(0.58 0.13 75 / 0.08)", border: "1px solid oklch(0.92 0.018 86)" }}>
                      <cat.Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-tight">{cat.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* ── Gold divider ─────────────────────────────────────────────────── */}
      <div className="divider-gold" />

      {/* ── Featured Listings ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.section
          key={`featured-${mode}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="py-14 bg-secondary/30"
        >
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  {mode === "products" ? "Featured Products" : "Featured Services"}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {mode === "products" ? "Hand-picked halal products from top sellers" : "Highly rated service providers"}
                </p>
              </div>
              <Link href={mode === "products" ? "/products" : "/services"}
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {mode === "products" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayProducts.length > 0 ? displayProducts.map((product, i) => (
                  <motion.div key={product.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}>
                    <ProductCard product={product} />
                  </motion.div>
                )) : (
                  <EmptyState mode="products" />
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayServices.length > 0 ? displayServices.map((service, i) => (
                  <motion.div key={service.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06 }}>
                    <ServiceCard service={service} />
                  </motion.div>
                )) : (
                  <EmptyState mode="services" />
                )}
              </div>
            )}
          </div>
        </motion.section>
      </AnimatePresence>

      {/* ── Trust Pillars ─────────────────────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">Why Choose Noor Marketplace?</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto">Built on Islamic values of trust, fairness, and community</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Halal Verified", desc: "All products and services are screened for halal compliance by our team.", color: "oklch(0.40 0.12 140)" },
              { icon: Award, title: "Trusted Sellers", desc: "Every seller is verified and rated by the community for accountability.", color: "oklch(0.83 0.19 88)" },
              { icon: Truck, title: "Global Delivery", desc: "Sellers ship worldwide with tracked delivery and buyer protection.", color: "oklch(0.45 0.10 220)" },
              { icon: Users, title: "Ummah First", desc: "A portion of every commission supports Islamic charities globally.", color: "oklch(0.50 0.12 30)" },
            ].map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border hover:shadow-elegant transition-all duration-300">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sell on Noor CTA ──────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden" style={{ background: "linear-gradient(135deg, oklch(0.12 0.018 42) 0%, oklch(0.18 0.022 45) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a017' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="container relative">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="font-arabic text-3xl block mb-3" style={{ color: "oklch(0.88 0.17 88)" }}>بارك الله فيك</span>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4" style={{ color: "oklch(0.96 0.006 85)" }}>
                Start Selling on Noor
              </h2>
              <p className="text-base mb-8 leading-relaxed" style={{ color: "oklch(0.75 0.01 80)" }}>
                Join hundreds of Muslim entrepreneurs. List products or services for free for 14 days,
                then just 7% commission (6.5% platform + 0.5% auto-donated to charity) — lower than any mainstream platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {["Free 14-day trial", "Only 7% commission", "0.5% to charity", "Global reach"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.85 0.01 80)" }}>
                    <CheckCircle className="w-4 h-4" style={{ color: "oklch(0.88 0.17 88)" }} />
                    {f}
                  </div>
                ))}
              </div>
              <Button size="lg" className="h-12 px-10 rounded-xl font-medium text-foreground hover:opacity-90 transition-opacity"
                style={{ background: "linear-gradient(135deg, oklch(0.88 0.17 88), oklch(0.75 0.20 86))" }} asChild>
                <Link href="/seller/dashboard">
                  <Store className="w-4 h-4 mr-2" />
                  Open Your Shop
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Seasonal Sections ────────────────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">Shop by Occasion</h2>
            <p className="text-sm text-muted-foreground">Curated collections for every blessed moment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Ramadan", arabic: "رمضان", desc: "Lanterns, prayer sets, iftar essentials & more", Icon: Moon, href: "/products?category=ramadan-eid", color: "oklch(0.18 0.04 260)" },
              { title: "Eid Collection", arabic: "عيد مبارك", desc: "Gifts, fashion, sweets & celebration items", Icon: Gift, href: "/products?category=ramadan-eid", color: "oklch(0.18 0.05 140)" },
              { title: "Hajj & Umrah", arabic: "لبيك اللهم", desc: "Ihram, prayer beads, travel essentials", Icon: MapPin, href: "/products?category=hajj-umrah", color: "oklch(0.18 0.04 45)" },
            ].map(({ title, arabic, desc, Icon: OccasionIcon, href, color }, i) => (
              <motion.div key={title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative overflow-hidden rounded-2xl p-6 border border-border cursor-pointer hover:shadow-elegant transition-all duration-300 group"
                style={{ background: `linear-gradient(135deg, ${color} 0%, oklch(0.15 0.02 45) 100%)` }}
              >
                <Link href={href} className="block">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <OccasionIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-arabic text-lg mb-1" style={{ color: "oklch(0.88 0.17 88)" }}>{arabic}</div>
                  <h3 className="font-serif text-xl font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.7)" }}>{desc}</p>
                  <span className="text-sm font-medium flex items-center gap-1" style={{ color: "oklch(0.88 0.17 88)" }}>
                    Shop Now <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Products ───────────────────────────────────────────── */}
      <section className="py-14 bg-secondary/20">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Trending Now</h2>
              <p className="text-sm text-muted-foreground mt-1">Most popular products this week</p>
            </div>
            <Link href="/products?sortBy=popular" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayProducts.slice(0, 4).length > 0 ? displayProducts.slice(0, 4).map((product, i) => (
              <motion.div key={product.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <ProductCard product={product} />
              </motion.div>
            )) : (
              <div className="col-span-4 text-center py-12 text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Products coming soon — be the first to list!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Featured Service Providers ───────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Top Service Providers</h2>
              <p className="text-sm text-muted-foreground mt-1">Highly rated professionals in the Ummah</p>
            </div>
            <Link href="/services" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayServices.slice(0, 4).length > 0 ? displayServices.slice(0, 4).map((service, i) => (
              <motion.div key={service.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <ServiceCard service={service} />
              </motion.div>
            )) : (
              <div className="col-span-4 text-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Services coming soon — be the first to offer yours!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-14 bg-secondary/20">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-2">How It Works</h2>
            <p className="text-sm text-muted-foreground">Simple, transparent, and halal</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Discover", desc: "Browse thousands of halal products and Islamic services from verified sellers." },
              { step: "02", title: "Connect", desc: "Message sellers, book services, and add products to your cart with confidence." },
              { step: "03", title: "Transact", desc: "Pay securely via Stripe. Sellers receive instant payouts after delivery confirmation." },
            ].map(({ step, title, desc }, i) => (
              <motion.div key={step}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative p-6 rounded-2xl bg-card border border-border text-center">
                <div className="font-serif text-4xl font-bold mb-3 gradient-text">{step}</div>
                <h3 className="font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/how-it-works" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 justify-center">
              Learn more <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Near Me Discovery ──────────────────────────────────────────── */}
      <NearMeDiscovery />

      {/* ── Smart Bundles ────────────────────────────────────────────────── */}
      <SmartBundles />

      {/* ── New Seller Spotlight ─────────────────────────────────────────── */}
      <NewSellerSpotlight />

      {/* ── Community Reviews ────────────────────────────────────────────── */}
      <CommunityReviews />

      {/* ── Islamic Gifting ──────────────────────────────────────────────── */}
      <IslamicGiftingSystem />

      {/* ── Charity Impact ───────────────────────────────────────────────── */}
      <CharityImpactSection />

      {/* ── Trust Badges ─────────────────────────────────────────────────── */}
      <TrustBadgesSection />

      {/* ── WhatsApp Support ─────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <WhatsAppSupport />
      </div>

    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: {
  id: number; title: string; price: string; comparePrice?: string | null;
  images: unknown; isHalalCertified?: boolean | null; avgRating?: string | null; reviewCount?: number | null;
  shopName?: string | null;
}}) {
  const images = (product.images as string[]) ?? [];
  const rating = product.avgRating ? parseFloat(product.avgRating) : 0;

  return (
    <Link href={`/products/${product.id}`}>
      <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-elegant transition-all duration-300 cursor-pointer product-card">
        <div className="relative aspect-square overflow-hidden bg-secondary">
          {images[0] ? (
            <img src={images[0]} alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-10 h-10 text-muted-foreground/40" />
            </div>
          )}
          {product.isHalalCertified && (
            <div className="absolute top-2 left-2">
              <span className="halal-badge flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Halal</span>
            </div>
          )}
          {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
            <div className="absolute top-2 right-2">
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0.5">
                -{Math.round((1 - parseFloat(product.price) / parseFloat(product.comparePrice)) * 100)}%
              </Badge>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-1 truncate">{product.shopName || "Noor Seller"}</p>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-snug mb-2">{product.title}</h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-foreground">£{parseFloat(product.price).toFixed(2)}</span>
              {product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price) && (
                <span className="text-xs text-muted-foreground line-through ml-1.5">
                  £{parseFloat(product.comparePrice).toFixed(2)}
                </span>
              )}
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <StarRating rating={rating} />
                <span className="text-[10px] text-muted-foreground">({product.reviewCount ?? 0})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Service Card ──────────────────────────────────────────────────────────────
function ServiceCard({ service }: { service: {
  id: number; title: string; price: string; duration?: number | null;
  images: unknown; locationType?: string | null; avgRating?: string | null; reviewCount?: number | null;
  providerName?: string | null;
}}) {
  const images = (service.images as string[]) ?? [];
  const rating = service.avgRating ? parseFloat(service.avgRating) : 0;

  return (
    <Link href={`/services/${service.id}`}>
      <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-elegant transition-all duration-300 cursor-pointer product-card">
        <div className="relative h-40 overflow-hidden bg-secondary">
          {images[0] ? (
            <img src={images[0]} alt={service.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Calendar className="w-10 h-10 text-muted-foreground/40" />
            </div>
          )}
          {service.locationType && (
            <div className="absolute bottom-2 left-2">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: "oklch(0.12 0.018 42 / 0.75)", color: "oklch(0.92 0.018 86)" }}>
                {service.locationType === "online" ? "Online" : service.locationType === "in_person" ? "In Person" : "Online & In Person"}
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-1 truncate">{service.providerName || "Noor Provider"}</p>
          <h3 className="font-medium text-sm text-foreground line-clamp-2 leading-snug mb-2">{service.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">From £{parseFloat(service.price).toFixed(2)}</span>
              {service.duration && (
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />{service.duration}m
                </span>
              )}
            </div>
            {rating > 0 && (
              <div className="flex items-center gap-1">
                <StarRating rating={rating} />
                <span className="text-[10px] text-muted-foreground">({service.reviewCount ?? 0})</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ mode }: { mode: "products" | "services" }) {
  return (
    <div className="col-span-full py-16 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{ background: "oklch(0.58 0.13 75 / 0.08)", border: "1px solid oklch(0.92 0.018 86)" }}>
        {mode === "products" ? <ShoppingBag className="w-7 h-7 text-primary" /> : <Calendar className="w-7 h-7 text-primary" />}
      </div>
      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
        {mode === "products" ? "No products yet" : "No services yet"}
      </h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">
        Be the first to list your {mode === "products" ? "halal products" : "Islamic services"} on Noor Marketplace.
      </p>
      <Button asChild className="text-primary-foreground"
        style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }}>
        <Link href="/seller/dashboard">
          <Sparkles className="w-4 h-4 mr-2" />
          {mode === "products" ? "Add Your First Product" : "Offer Your Service"}
        </Link>
      </Button>
    </div>
  );
}
