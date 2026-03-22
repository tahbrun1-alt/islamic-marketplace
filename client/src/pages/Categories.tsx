import { Link } from "wouter";
import { Package, Calendar, ArrowRight, TrendingUp, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const productCategories = [
  { name: "Islamic Clothing", icon: "👗", slug: "clothing", desc: "Modest fashion, abayas, thobes, hijabs", count: "2,400+" },
  { name: "Quran & Books", icon: "📖", slug: "books", desc: "Qurans, Islamic literature, children's books", count: "1,200+" },
  { name: "Prayer Items", icon: "🕌", slug: "prayer", desc: "Prayer mats, tasbeeh, miswak, compasses", count: "800+" },
  { name: "Halal Food", icon: "🍽️", slug: "food", desc: "Halal snacks, dates, sweets, spices", count: "600+" },
  { name: "Home & Decor", icon: "🏡", slug: "home-decor", desc: "Islamic art, calligraphy, wall decor", count: "950+" },
  { name: "Ramadan & Eid", icon: "🌙", slug: "ramadan-eid", desc: "Lanterns, gifts, decorations, kits", count: "1,100+" },
  { name: "Hajj & Umrah", icon: "🕋", slug: "hajj-umrah", desc: "Ihram, travel essentials, prayer beads", count: "400+" },
  { name: "Kids & Baby", icon: "👶", slug: "kids", desc: "Islamic toys, clothing, books for children", count: "700+" },
  { name: "Jewellery", icon: "💍", slug: "jewellery", desc: "Halal-certified modest jewellery", count: "500+" },
  { name: "Perfumes & Oud", icon: "🌹", slug: "perfumes", desc: "Alcohol-free attar, oud, bakhoor", count: "350+" },
  { name: "Health & Beauty", icon: "✨", slug: "health-beauty", desc: "Halal cosmetics, natural skincare", count: "450+" },
  { name: "Gifts & Bundles", icon: "🎁", slug: "gifts", desc: "Curated gift sets for every occasion", count: "300+" },
];

const serviceCategories = [
  { name: "Islamic Education", icon: "📚", slug: "education", desc: "Quran tutors, Arabic lessons, Islamic studies", count: "500+" },
  { name: "Hijama & Wellness", icon: "🌿", slug: "wellness", desc: "Cupping therapy, ruqyah, holistic health", count: "200+" },
  { name: "Photography", icon: "📷", slug: "photography", desc: "Nikah, Aqiqah, family & event photography", count: "350+" },
  { name: "Tailoring", icon: "✂️", slug: "tailoring", desc: "Custom abayas, thobes, alterations", count: "180+" },
  { name: "Catering & Food", icon: "🍲", slug: "catering", desc: "Halal catering for events and occasions", count: "250+" },
  { name: "Event Planning", icon: "🎪", slug: "events", desc: "Nikah, Aqiqah, Eid party planning", count: "120+" },
  { name: "Legal & Finance", icon: "⚖️", slug: "legal-finance", desc: "Islamic wills, halal mortgages, finance advice", count: "90+" },
  { name: "IT & Tech", icon: "💻", slug: "tech", desc: "Muslim-owned tech services and development", count: "150+" },
  { name: "Cleaning", icon: "🧹", slug: "cleaning", desc: "Home and commercial cleaning services", count: "200+" },
  { name: "Childcare", icon: "👨‍👩‍👧", slug: "childcare", desc: "Islamic nurseries, babysitting, tutoring", count: "100+" },
  { name: "Therapy & Counselling", icon: "🧠", slug: "therapy", desc: "Islamic counselling, marriage guidance", count: "80+" },
  { name: "Transport", icon: "🚗", slug: "transport", desc: "Airport transfers, wedding cars, logistics", count: "130+" },
];

const trendingCategories = [
  { name: "Ramadan Kits", icon: "🌙", href: "/products?category=ramadan-eid", badge: "Seasonal" },
  { name: "Quran Tutors", icon: "📖", href: "/services?category=education", badge: "Popular" },
  { name: "Modest Fashion", icon: "👗", href: "/products?category=clothing", badge: "Trending" },
  { name: "Nikah Packages", icon: "💍", href: "/services?category=events", badge: "New" },
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
                  <div className="text-3xl mb-2">{cat.icon}</div>
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
                  <div className="text-3xl mb-2">{cat.icon}</div>
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
                    {cat.icon}
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
                  <div className="text-3xl mb-2">{cat.icon}</div>
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
                    {cat.icon}
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
