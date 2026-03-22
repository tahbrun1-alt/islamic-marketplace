import { useState, useEffect } from "react";
import { Link } from "wouter";
import { ChevronRight, X } from "lucide-react";

type Season = "ramadan" | "eid" | "hajj" | "muharram" | "normal";

interface SeasonConfig {
  name: string;
  arabicName: string;
  greeting: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  emoji: string;
  categories: { label: string; href: string; icon: string }[];
}

const SEASON_CONFIGS: Record<Season, SeasonConfig> = {
  ramadan: {
    name: "Ramadan",
    arabicName: "رمضان كريم",
    greeting: "Ramadan Mubarak",
    tagline: "Everything you need for a blessed Ramadan — dates, prayer essentials, iftar gifts & more.",
    ctaText: "Shop Ramadan Collection",
    ctaLink: "/products?category=ramadan",
    bgGradient: "from-indigo-900 via-purple-900 to-indigo-800",
    textColor: "text-white",
    accentColor: "text-amber-300",
    emoji: "🌙",
    categories: [
      { label: "Dates & Sweets", href: "/products?category=dates", icon: "🌴" },
      { label: "Prayer Essentials", href: "/products?category=prayer", icon: "🧿" },
      { label: "Iftar Gifts", href: "/products?category=gifts", icon: "🎁" },
      { label: "Quran & Books", href: "/products?category=books", icon: "📖" },
      { label: "Modest Fashion", href: "/products?category=fashion", icon: "👗" },
      { label: "Ramadan Decor", href: "/products?category=decor", icon: "🪔" },
    ],
  },
  eid: {
    name: "Eid",
    arabicName: "عيد مبارك",
    greeting: "Eid Mubarak",
    tagline: "Celebrate Eid with the Ummah — gifts, outfits, sweets and everything in between.",
    ctaText: "Shop Eid Gifts",
    ctaLink: "/products?category=eid",
    bgGradient: "from-emerald-700 via-teal-700 to-emerald-800",
    textColor: "text-white",
    accentColor: "text-yellow-300",
    emoji: "🌟",
    categories: [
      { label: "Eid Gifts", href: "/products?category=eid-gifts", icon: "🎁" },
      { label: "Eid Outfits", href: "/products?category=eid-fashion", icon: "👘" },
      { label: "Sweets & Treats", href: "/products?category=sweets", icon: "🍬" },
      { label: "Henna & Beauty", href: "/services?category=beauty", icon: "🌸" },
      { label: "Eid Cards", href: "/products?category=cards", icon: "💌" },
      { label: "Charity Gifts", href: "/products?category=charity", icon: "💚" },
    ],
  },
  hajj: {
    name: "Hajj & Umrah",
    arabicName: "حج مبارك",
    greeting: "Hajj Mubarak",
    tagline: "Prepare for your blessed journey — ihram, essentials, duas and travel packages.",
    ctaText: "Shop Hajj Essentials",
    ctaLink: "/products?category=hajj",
    bgGradient: "from-amber-700 via-orange-700 to-amber-800",
    textColor: "text-white",
    accentColor: "text-yellow-200",
    emoji: "🕋",
    categories: [
      { label: "Ihram Sets", href: "/products?category=ihram", icon: "🤍" },
      { label: "Travel Bags", href: "/products?category=travel", icon: "🎒" },
      { label: "Dua Books", href: "/products?category=duas", icon: "📿" },
      { label: "Prayer Mats", href: "/products?category=prayer-mats", icon: "🧎" },
      { label: "Zamzam Bottles", href: "/products?category=zamzam", icon: "💧" },
      { label: "Hajj Guides", href: "/products?category=guides", icon: "📚" },
    ],
  },
  muharram: {
    name: "Islamic New Year",
    arabicName: "عام هجري جديد",
    greeting: "Happy New Hijri Year",
    tagline: "Start the new Islamic year with blessings — Islamic gifts, books, and spiritual essentials.",
    ctaText: "Explore New Year Picks",
    ctaLink: "/products?category=new-year",
    bgGradient: "from-slate-800 via-blue-900 to-slate-800",
    textColor: "text-white",
    accentColor: "text-sky-300",
    emoji: "🌙",
    categories: [
      { label: "Islamic Books", href: "/products?category=books", icon: "📚" },
      { label: "Journals", href: "/products?category=journals", icon: "📓" },
      { label: "Prayer Beads", href: "/products?category=tasbih", icon: "📿" },
      { label: "Wall Art", href: "/products?category=art", icon: "🖼️" },
      { label: "Attar & Oud", href: "/products?category=fragrance", icon: "🌹" },
      { label: "Charity Packs", href: "/products?category=charity", icon: "💚" },
    ],
  },
  normal: {
    name: "Noor Marketplace",
    arabicName: "نور",
    greeting: "Welcome to Noor",
    tagline: "The UK's first Islamic marketplace — connecting the Ummah, one transaction at a time.",
    ctaText: "Start Shopping",
    ctaLink: "/products",
    bgGradient: "from-amber-600 via-orange-600 to-amber-700",
    textColor: "text-white",
    accentColor: "text-yellow-200",
    emoji: "✨",
    categories: [
      { label: "Products", href: "/products", icon: "🛍️" },
      { label: "Services", href: "/services", icon: "🤝" },
      { label: "Sellers", href: "/sellers", icon: "🏪" },
      { label: "New Arrivals", href: "/products?sort=newest", icon: "🆕" },
      { label: "Featured", href: "/products?featured=true", icon: "⭐" },
      { label: "Near Me", href: "/services?view=local", icon: "📍" },
    ],
  },
};

function detectSeason(): Season {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  // Approximate Hijri calendar detection (simplified)
  // In production this would use a proper Hijri calendar library
  // For 2026: Ramadan ~Feb/Mar, Eid al-Fitr ~Mar, Eid al-Adha ~Jun, Hajj ~Jun, Muharram ~Jul
  if (month === 3 && day <= 30) return "ramadan";
  if (month === 4 && day <= 10) return "eid";
  if (month === 6 && day >= 10 && day <= 20) return "hajj";
  if (month === 7 && day <= 10) return "muharram";
  return "normal";
}

interface SeasonalBannerProps {
  forceSeason?: Season;
  compact?: boolean;
}

export function SeasonalBanner({ forceSeason, compact = false }: SeasonalBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [season] = useState<Season>(forceSeason ?? detectSeason());
  const config = SEASON_CONFIGS[season];

  if (dismissed || season === "normal") return null;

  return (
    <div className={`relative bg-gradient-to-r ${config.bgGradient} ${compact ? "py-3" : "py-6"}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{config.emoji}</span>
            <div>
              <p className={`font-bold ${config.accentColor} text-sm`}>{config.arabicName}</p>
              <p className={`font-semibold ${config.textColor} ${compact ? "text-sm" : "text-base"}`}>
                {config.greeting} — {config.tagline}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={config.ctaLink}>
              <button className="hidden sm:flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-sm px-4 py-1.5 rounded-full transition-colors">
                {config.ctaText}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeasonalSectionProps {
  forceSeason?: Season;
}

export function SeasonalSection({ forceSeason }: SeasonalSectionProps) {
  const [season] = useState<Season>(forceSeason ?? detectSeason());
  const config = SEASON_CONFIGS[season];

  return (
    <section className={`py-12 bg-gradient-to-br ${config.bgGradient}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className={`text-3xl font-bold ${config.accentColor} mb-1`}>{config.arabicName}</p>
          <h2 className={`text-2xl font-bold ${config.textColor} mb-2`}>{config.greeting}</h2>
          <p className={`${config.textColor} opacity-80 max-w-xl mx-auto text-sm`}>{config.tagline}</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-8">
          {config.categories.map((cat) => (
            <Link key={cat.href} href={cat.href}>
              <div className="flex flex-col items-center gap-2 bg-white/10 hover:bg-white/20 rounded-xl p-3 cursor-pointer transition-all group">
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-xs font-medium ${config.textColor} text-center leading-tight`}>
                  {cat.label}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href={config.ctaLink}>
            <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-yellow-50 transition-colors shadow-lg">
              {config.ctaText}
              <ChevronRight className="inline w-4 h-4 ml-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SeasonalSection;
