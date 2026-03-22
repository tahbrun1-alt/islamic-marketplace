import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import {
  Star, ShoppingBag, Calendar, Shield, Heart,
  ArrowRight, CheckCircle, Users, Package, Sparkles,
  ChevronRight, Globe, Award, Clock, MapPin, Store
} from "lucide-react";

// ─── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

// ─── Static data ─────────────────────────────────────────────────────────────

const productCategories = [
  { name: "Modest Fashion", slug: "modest-fashion", icon: "👗", color: "from-emerald-50 to-emerald-100", count: "2.4k+" },
  { name: "Prayer Items", slug: "prayer-items", icon: "🕌", color: "from-amber-50 to-amber-100", count: "1.2k+" },
  { name: "Qurans & Books", slug: "qurans-books", icon: "📖", color: "from-blue-50 to-blue-100", count: "800+" },
  { name: "Islamic Art", slug: "islamic-art", icon: "🎨", color: "from-purple-50 to-purple-100", count: "650+" },
  { name: "Perfumes & Attar", slug: "perfumes-attar", icon: "🌹", color: "from-rose-50 to-rose-100", count: "430+" },
  { name: "Gifts & Decor", slug: "gifts-decor", icon: "🎁", color: "from-orange-50 to-orange-100", count: "1.1k+" },
  { name: "Ramadan & Eid", slug: "ramadan-eid", icon: "🌙", color: "from-indigo-50 to-indigo-100", count: "920+" },
  { name: "Hajj & Umrah", slug: "hajj-umrah", icon: "🕋", color: "from-teal-50 to-teal-100", count: "340+" },
];

const serviceCategories = [
  { name: "Quran Tutoring", slug: "quran-tutoring", icon: "📖", desc: "Online & in-person" },
  { name: "Hijama Therapy", slug: "hijama-therapy", icon: "⚕️", desc: "Certified practitioners" },
  { name: "Islamic Counselling", slug: "islamic-counselling", icon: "💬", desc: "Qualified counsellors" },
  { name: "Halal Catering", slug: "halal-catering", icon: "🍽️", desc: "Events & occasions" },
  { name: "Arabic Lessons", slug: "arabic-lessons", icon: "🔤", desc: "All levels welcome" },
  { name: "Henna & Beauty", slug: "henna-beauty", icon: "💅", desc: "Halal certified" },
  { name: "Photography", slug: "photography", icon: "📸", desc: "Islamic events" },
  { name: "Nikah Services", slug: "nikah-services", icon: "💒", desc: "Imams & planners" },
];

const features = [
  {
    icon: Shield,
    title: "Halal Verified",
    desc: "All sellers are vetted to ensure their products and services meet Islamic standards.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Users,
    title: "Ummah Community",
    desc: "A trusted marketplace built by and for the Muslim community worldwide.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Award,
    title: "Seller Support",
    desc: "14-day free trial, then just 6.5% commission. No monthly fees.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Globe,
    title: "Worldwide Shipping",
    desc: "Connect with sellers across the globe. Delivery to 180+ countries.",
    color: "text-purple-600 bg-purple-50",
  },
];

const testimonials = [
  {
    name: "Fatima Al-Hassan",
    location: "London, UK",
    rating: 5,
    text: "Alhamdulillah, finally a marketplace where I can trust every seller. Found the most beautiful abaya for Eid!",
    avatar: "F",
  },
  {
    name: "Ahmed Siddiqui",
    location: "Birmingham, UK",
    rating: 5,
    text: "My Quran tutoring service has grown 3x since joining Noor. The booking system is seamless, masha'Allah.",
    avatar: "A",
  },
  {
    name: "Zainab Mohammed",
    location: "Manchester, UK",
    rating: 5,
    text: "The Islamic art selection is incredible. I've decorated my entire home with pieces from Noor sellers.",
    avatar: "Z",
  },
];

const stats = [
  { value: "50,000+", label: "Happy Customers" },
  { value: "3,200+", label: "Verified Sellers" },
  { value: "180+", label: "Countries Served" },
  { value: "4.9★", label: "Average Rating" },
];

// ─── Components ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: { id: number; title: string; price: string; images?: unknown; rating?: string | number | null; reviewCount?: number | null; shopId: number } }) {
  const images = (product.images as string[]) ?? [];
  const image = images[0];
  return (
    <Link href={`/products/${product.id}`}>
      <div className="product-card rounded-xl overflow-hidden bg-white border border-border cursor-pointer group">
        <div className="aspect-square bg-secondary overflow-hidden relative">
          {image ? (
            <img src={image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
          )}
          <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
            <Heart className="w-4 h-4 text-muted-foreground hover:text-rose-500 transition-colors" />
          </button>
        </div>
        <div className="p-3">
          <p className="text-sm font-medium line-clamp-2 mb-1 text-foreground">{product.title}</p>
          <div className="flex items-center gap-1 mb-2">
            <StarRating rating={Number(product.rating ?? 0)} />
            <span className="text-xs text-muted-foreground">({product.reviewCount ?? 0})</span>
          </div>
          <p className="font-bold text-primary">£{Number(product.price).toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}

function ServiceCard({ service }: { service: { id: number; title: string; price: string; images?: unknown; rating?: string | number | null; reviewCount?: number | null; duration: number; locationType: string } }) {
  const images = (service.images as string[]) ?? [];
  const image = images[0];
  return (
    <Link href={`/services/${service.id}`}>
      <div className="product-card rounded-xl overflow-hidden bg-white border border-border cursor-pointer group">
        <div className="aspect-video bg-secondary overflow-hidden relative">
          {image ? (
            <img src={image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">🌟</div>
          )}
        </div>
        <div className="p-3">
          <p className="text-sm font-medium line-clamp-2 mb-1 text-foreground">{service.title}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration}min</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {service.locationType.replace("_", " ")}</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-bold text-primary">from £{Number(service.price).toFixed(2)}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{service.rating ?? "New"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: featuredProducts } = trpc.products.featured.useQuery();
  const { data: featuredServices } = trpc.services.list.useQuery({ isFeatured: true, limit: 8 });
  const { data: featuredShops } = trpc.shops.featured.useQuery();

  return (
    <div className="min-h-screen">
      {/* ── Hero Section ── */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Geometric pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container relative z-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="text-white"
            >
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>The UK's #1 Islamic Marketplace</span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl lg:text-6xl font-bold leading-tight mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Shop with{" "}
                <span className="text-amber-300">Barakah</span>
                <br />
                from the Ummah
              </motion.h1>

              <motion.p variants={fadeUp} className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                Discover thousands of halal products and Islamic services from verified Muslim sellers worldwide. From modest fashion to Quran tutoring — all in one blessed marketplace.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold shadow-lg" asChild>
                  <Link href="/products">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Shop Products
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" asChild>
                  <Link href="/services">
                    <Calendar className="w-5 h-5 mr-2" />
                    Find Services
                  </Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-6 mt-10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-amber-300">{stat.value}</p>
                    <p className="text-sm text-white/70">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right: Floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative h-96">
                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-0 right-0 bg-white rounded-2xl p-5 shadow-2xl w-64"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">🧕</div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Premium Abaya</p>
                      <p className="text-xs text-muted-foreground">by Modest Threads</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-primary text-lg">£89.99</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium">4.9</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="halal-badge">✓ Halal Verified</span>
                  </div>
                </motion.div>

                {/* Service card */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-8 left-0 bg-white rounded-2xl p-4 shadow-2xl w-56"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-xl">📖</div>
                    <div>
                      <p className="font-semibold text-sm text-foreground">Quran Tutoring</p>
                      <p className="text-xs text-muted-foreground">Online sessions</p>
                    </div>
                  </div>
                  <p className="text-primary font-bold text-sm">from £25/hr</p>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs text-muted-foreground">Certified teacher</span>
                  </div>
                </motion.div>

                {/* Notification */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute top-32 left-8 bg-white rounded-xl p-3 shadow-xl flex items-center gap-3 w-52"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm">✓</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Order Delivered!</p>
                    <p className="text-xs text-muted-foreground">Alhamdulillah 🤲</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" fillOpacity="0.97" />
          </svg>
        </div>
      </section>

      {/* ── Product Categories ── */}
      <section className="py-16 pattern-bg">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-10"
          >
            <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Browse by Category</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-foreground">
              Islamic Products
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mt-2 max-w-xl mx-auto">
              From modest fashion to prayer essentials — find everything halal in one place.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
          >
            {productCategories.map((cat, i) => (
              <motion.div key={cat.slug} variants={fadeUp} custom={i}>
                <Link href={`/products?category=${cat.slug}`}>
                  <div className={`bg-gradient-to-br ${cat.color} rounded-xl p-4 text-center hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-white`}>
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="text-xs font-semibold text-foreground leading-tight">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-6">
            <Button variant="outline" asChild>
              <Link href="/products">
                View All Products <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">Hand-picked for you</p>
              <h2 className="text-3xl font-bold text-foreground">Featured Products</h2>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/products">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {featuredProducts.map((product, i) => (
                <motion.div key={product.id} variants={fadeUp} custom={i}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl overflow-hidden bg-secondary animate-pulse">
                  <div className="aspect-square bg-muted" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Services Banner ── */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Islamic Services</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Book Trusted Muslim Service Providers
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                From Quran tutors to hijama therapists, halal caterers to Islamic counsellors — book verified Muslim professionals with ease. Deposits, scheduling, and payments all handled securely.
              </p>
              <div className="space-y-3 mb-8">
                {["Instant booking with calendar integration", "Secure deposit & payment system", "Verified Muslim professionals", "Online & in-person options"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href="/services">
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse All Services
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-2 gap-3"
            >
              {serviceCategories.map((cat, i) => (
                <motion.div key={cat.slug} variants={fadeUp} custom={i}>
                  <Link href={`/services?category=${cat.slug}`}>
                    <div className="bg-white rounded-xl p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border group">
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Featured Services ── */}
      {featuredServices && featuredServices.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-1">Top Rated</p>
                <h2 className="text-3xl font-bold text-foreground">Featured Services</h2>
              </div>
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/services">View All <ChevronRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {featuredServices.slice(0, 8).map((service, i) => (
                <motion.div key={service.id} variants={fadeUp} custom={i}>
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="py-16 pattern-bg">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Why Noor?</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-foreground">
              Shopping with Barakah
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div key={feature.title} variants={fadeUp} custom={i}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Seller CTA ── */}
      <section className="py-16 bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary to-emerald-700 rounded-3xl p-8 lg:p-12 text-white text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Start selling today — free for 14 days</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Sell to the Global Ummah
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8 text-lg">
                Join 3,200+ Muslim sellers earning halal income. No monthly fees — just 6.5% commission after your free trial.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold shadow-lg" asChild>
                  <Link href={isAuthenticated ? "/seller/create" : getLoginUrl()}>
                    <Store className="w-5 h-5 mr-2" />
                    Open Your Shop
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent" asChild>
                  <Link href="/how-it-works">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-8 justify-center mt-8">
                {[
                  { icon: Package, text: "Products & Services" },
                  { icon: Shield, text: "Secure Payments" },
                  { icon: Users, text: "50k+ Customers" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-2 text-white/80">
                    <item.icon className="w-4 h-4" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 pattern-bg">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Community Love</motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl lg:text-4xl font-bold text-foreground">
              What the Ummah Says
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} custom={i}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardContent className="p-6">
                    <StarRating rating={t.rating} />
                    <p className="text-muted-foreground mt-4 mb-6 leading-relaxed italic">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-foreground text-white py-16">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">ن</div>
                <div>
                  <div className="font-bold text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Noor Marketplace</div>
                </div>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                The trusted Islamic marketplace for the global Ummah. Shop halal, sell with barakah.
              </p>
              <p className="text-white/40 text-xs" style={{ fontFamily: "'Amiri', serif" }}>
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Marketplace", links: [{ label: "All Products", href: "/products" }, { label: "All Services", href: "/services" }, { label: "Sellers", href: "/sellers" }, { label: "New Arrivals", href: "/products?sort=newest" }] },
              { title: "Sell on Noor", links: [{ label: "Open a Shop", href: "/seller/create" }, { label: "Seller Dashboard", href: "/seller/dashboard" }, { label: "Commission & Fees", href: "/how-it-works" }, { label: "Seller Guide", href: "/seller-guide" }] },
              { title: "Support", links: [{ label: "Help Centre", href: "/help" }, { label: "Contact Us", href: "/contact" }, { label: "Terms & Conditions", href: "/terms" }, { label: "Privacy Policy", href: "/privacy" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm mb-4 text-white/90">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-white/60 hover:text-white text-sm transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">© 2025 Noor Marketplace. All rights reserved.</p>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Shield className="w-4 h-4" />
              <span>Secure payments • Halal verified • UK registered</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


