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
  Home as HomeIcon, Utensils, Gem, Camera, Leaf, Handshake, Languages,
  Activity, Gift, Moon, GraduationCap, Scissors, LucideIcon
} from "lucide-react";

// Custom Ring icon since it's missing from lucide-react
const Ring = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="14" r="7" />
    <path d="M12 7V2" />
    <path d="M9 4h6" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PRODUCT_CATEGORIES: { name: string; Icon: LucideIcon; href: string }[] = [
  { name: "Modest Fashion", Icon: Shirt,     href: "/products?category=modest-fashion" },
  { name: "Prayer Items",   Icon: Circle,    href: "/products?category=prayer-items" },
  { name: "Islamic Books",  Icon: BookOpen,  href: "/products?category=qurans-books" },
  { name: "Home & Decor",   Icon: HomeIcon,  href: "/products?category=gifts-decor" },
  { name: "Halal Food",     Icon: Utensils,  href: "/products?category=halal-food" },
  { name: "Jewellery",      Icon: Gem,       href: "/products?category=jewellery" },
  { name: "Abayas",         Icon: Shirt,     href: "/products?category=abayas-jilbabs" },
  { name: "Ramadan & Eid",  Icon: Moon,      href: "/products?category=ramadan-eid" },
];

const SERVICE_CATEGORIES: { name: string; Icon: any; href: string }[] = [
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
                  {mode === "products" ? "Halal-certified products across all categories" : "Trusted Islamic services for your needs"}
                </p>
              </div>
              <Link href={mode === "products" ? "/products" : "/services"}>
                <Button variant="ghost" size="sm" className="text-primary font-medium">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {(mode === "products" ? PRODUCT_CATEGORIES : SERVICE_CATEGORIES).map((cat) => (
                <Link key={cat.name} href={cat.href}>
                  <div className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-secondary/30 border border-border/50 hover:border-primary/30 hover:bg-secondary/60 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-card flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                      <cat.Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs font-medium text-center text-foreground group-hover:text-primary transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* ── Near Me Discovery ────────────────────────────────────────────── */}
      <NearMeDiscovery />

      {/* ── Smart Bundles ────────────────────────────────────────────────── */}
      <SmartBundles />

      {/* ── Featured Listings ────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/20">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-serif text-3xl font-semibold text-foreground">Featured for You</h2>
              <p className="text-muted-foreground mt-2">Hand-picked selections from our top-rated sellers</p>
            </div>
            <div className="flex gap-2">
              <Link href="/products">
                <Button variant="outline" size="sm" className="rounded-full">Explore All</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.slice(0, 4).map((p: any) => (
              <Link key={p.id} href={`/products/${p.id}`}>
                <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-elegant transition-all cursor-pointer">
                  <div className="aspect-square relative overflow-hidden bg-secondary">
                    {(p.images as string[])?.[0] ? (
                      <img
                        src={(p.images as string[])[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-sm">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    {p.isFeatured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-primary text-primary-foreground border-none">Featured</Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {p.category?.replace("-", " ") || "Product"}
                      </span>
                      <StarRating rating={4.8} />
                    </div>
                    <h3 className="font-medium text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold text-foreground">£{Number(p.price).toFixed(2)}</span>
                      <Button size="sm" variant="secondary" className="h-8 rounded-lg text-xs font-bold">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
      <WhatsAppSupport />

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl font-semibold text-foreground mb-4">Connecting the Ummah</h2>
            <p className="text-muted-foreground">Noor Marketplace makes it easy to buy and sell within our community with trust and transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Shield,
                title: "Verified & Halal",
                desc: "Every seller is verified and products are checked for halal compliance to ensure peace of mind."
              },
              {
                icon: Clock,
                title: "Secure Transactions",
                desc: "Your payments are held in escrow until you receive your order, protecting both buyers and sellers."
              },
              {
                icon: Users,
                title: "Community Driven",
                desc: "Support Muslim-owned businesses and find services tailored to our unique lifestyle and values."
              }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container">
          <div className="relative rounded-[2rem] overflow-hidden bg-foreground p-10 lg:p-20 text-center">
            {/* Decorative background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none pattern-bg" />
            <div className="absolute top-0 left-0 w-full h-full"
              style={{ background: "radial-gradient(circle at center, oklch(0.83 0.19 88 / 0.15), transparent)" }} />

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="font-serif text-4xl lg:text-5xl font-semibold text-white mb-6">
                Ready to join the <span className="text-primary">Ummah</span> marketplace?
              </h2>
              <p className="text-white/70 text-lg mb-10">
                Whether you're looking for the perfect Eid gift or want to grow your business,
                Noor is the place for you.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button size="lg" className="h-14 px-10 rounded-xl text-primary-foreground font-bold shadow-lg hover:opacity-90 transition-opacity"
                  style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }} asChild>
                  <Link href="/register">Create Your Account</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 rounded-xl font-bold border-white/20 text-white hover:bg-white/10" asChild>
                  <Link href="/how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
