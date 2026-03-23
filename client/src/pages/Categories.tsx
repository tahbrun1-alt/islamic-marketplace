import { Link } from "wouter";
import { Package, Calendar, ArrowRight, TrendingUp, Star, Shirt, BookOpen, Circle, Utensils, Home, Moon, MapPin, Baby, Gem, FlaskConical, Sparkles, Gift, GraduationCap, Leaf, Camera, Scissors, ChefHat, PartyPopper, Scale, Monitor, Broom, Users, Brain, Car, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const productCategories: { name: string; Icon: LucideIcon; slug: string; desc: string }[] = [
  { name: "Islamic Clothing", Icon: Shirt,        slug: "clothing",     desc: "Modest fashion, abayas, thobes, hijabs" },
  { name: "Quran & Books",    Icon: BookOpen,     slug: "books",        desc: "Qurans, Islamic literature, children's books" },
  { name: "Prayer Items",     Icon: Circle,       slug: "prayer",       desc: "Prayer mats, tasbeeh, miswak, compasses" },
  { name: "Halal Food",       Icon: Utensils,     slug: "food",         desc: "Halal snacks, dates, sweets, spices" },
  { name: "Home & Decor",     Icon: Home,         slug: "home-decor",   desc: "Islamic art, calligraphy, wall decor" },
  { name: "Ramadan & Eid",    Icon: Moon,         slug: "ramadan-eid",  desc: "Lanterns, gifts, decorations, kits" },
  { name: "Hajj & Umrah",     Icon: MapPin,       slug: "hajj-umrah",   desc: "Ihram, travel essentials, prayer beads" },
  { name: "Kids & Baby",      Icon: Baby,         slug: "kids",         desc: "Islamic toys, clothing, books for children" },
  { name: "Jewellery",        Icon: Gem,          slug: "jewellery",    desc: "Halal-certified modest jewellery" },
  { name: "Perfumes & Oud",   Icon: FlaskConical, slug: "perfumes",     desc: "Alcohol-free attar, oud, bakhoor" },
  { name: "Health & Beauty",  Icon: Sparkles,     slug: "health-beauty",desc: "Halal cosmetics, natural skincare" },
  { name: "Gifts & Bundles",  Icon: Gift,         slug: "gifts",        desc: "Curated gift sets for every occasion" },
];

const serviceCategories: { name: string; Icon: LucideIcon; slug: string; desc: string }[] = [
  { name: "Islamic Education",     Icon: GraduationCap, slug: "education",    desc: "Quran tutors, Arabic lessons, Islamic studies" },
  { name: "Hijama & Wellness",     Icon: Leaf,          slug: "wellness",     desc: "Cupping therapy, ruqyah, holistic health" },
  { name: "Photography",           Icon: Camera,        slug: "photography",  desc: "Nikah, Aqiqah, family & event photography" },
  { name: "Tailoring",             Icon: Scissors,      slug: "tailoring",    desc: "Custom abayas, thobes, alterations" },
  { name: "Catering & Food",       Icon: ChefHat,       slug: "catering",     desc: "Halal catering for events and occasions" },
  { name: "Event Planning",        Icon: PartyPopper,   slug: "events",       desc: "Nikah, Aqiqah, Eid party planning" },
  { name: "Legal & Finance",       Icon: Scale,         slug: "legal-finance",desc: "Islamic wills, halal mortgages, finance advice" },
  { name: "IT & Tech",             Icon: Monitor,       slug: "tech",         desc: "Muslim-owned tech services and development" },
  { name: "Cleaning",              Icon: Broom,         slug: "cleaning",     desc: "Home and commercial cleaning services" },
  { name: "Childcare",             Icon: Users,         slug: "childcare",    desc: "Islamic nurseries, babysitting, tutoring" },
  { name: "Therapy & Counselling", Icon: Brain,         slug: "therapy",      desc: "Islamic counselling, marriage guidance" },
  { name: "Transport",             Icon: Car,           slug: "transport",    desc: "Airport transfers, wedding cars, logistics" },
];

const trendingCategories: { name: string; Icon: LucideIcon; href: string; badge: string }[] = [
  { name: "Ramadan Kits",  Icon: Moon,        href: "/products?category=ramadan-eid", badge: "Seasonal" },
  { name: "Quran Tutors",  Icon: BookOpen,    href: "/services?category=education",   badge: "Popular" },
  { name: "Modest Fashion",Icon: Shirt,       href: "/products?category=clothing",    badge: "Trending" },
  { name: "Nikah Packages",Icon: PartyPopper, href: "/services?category=events",      badge: "New" },
];

export default function Categories() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-950 via-amber-900 to-amber-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-4">
            <Star className="w-4 h-4 text-amber-300" />
            <span>Browse all categories</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Explore the Marketplace
          </h1>
          <p className="text-amber-100 text-lg max-w-2xl mx-auto">
            Discover thousands of halal products and Islamic services — all in one place, all verified for the Ummah.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Trending Now */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold">Trending Right Now</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingCategories.map((cat) => (
              <Link key={cat.name} href={cat.href}>
                <div className="group relative bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <Badge className="absolute top-3 right-3 text-xs" variant="secondary">{cat.badge}</Badge>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{background:"oklch(0.58 0.13 75 / 0.1)"}}><cat.Icon className="w-5 h-5 text-primary" /></div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{cat.name}</p>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground mt-1 group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Product Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-2xl font-semibold">Product Categories</h2>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/products">View All Products <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {productCategories.map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
                <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer text-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{background:"oklch(0.58 0.13 75 / 0.1)"}}><cat.Icon className="w-5 h-5 text-primary" /></div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors leading-tight">{cat.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cat.count} items</p>
                </div>
              </Link>
            ))}
          </div>
          {/* Category detail cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {productCategories.slice(0, 6).map((cat) => (
              <Link key={`detail-${cat.slug}`} href={`/products?category=${cat.slug}`}>
                <div className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                    <cat.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{cat.desc}</p>
                    <p className="text-xs text-primary font-medium mt-1">{cat.count} listings</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Service Categories */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-2xl font-semibold">Service Categories</h2>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/services">View All Services <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceCategories.map((cat) => (
              <Link key={cat.slug} href={`/services?category=${cat.slug}`}>
                <div className="group bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer text-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-2" style={{background:"oklch(0.58 0.13 75 / 0.1)"}}><cat.Icon className="w-5 h-5 text-primary" /></div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors leading-tight">{cat.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{cat.count} providers</p>
                </div>
              </Link>
            ))}
          </div>
          {/* Service detail cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCategories.slice(0, 6).map((cat) => (
              <Link key={`detail-${cat.slug}`} href={`/services?category=${cat.slug}`}>
                <div className="group flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-2xl shrink-0">
                    <cat.Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{cat.desc}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">{cat.count} providers</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-amber-900 to-amber-800 rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">Can't find what you're looking for?</h3>
          <p className="text-amber-100 mb-6">Use our search to find exactly what you need, or browse all listings.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-white text-amber-900 hover:bg-amber-50" asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/services">Browse All Services</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
