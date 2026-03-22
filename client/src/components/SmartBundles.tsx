import { useState } from "react";
import { Package, Scissors, Star, ChevronRight, Plus, Check, Tag } from "lucide-react";
import { Link } from "wouter";

interface BundleItem {
  type: "product" | "service";
  name: string;
  price: string;
  seller: string;
  rating: number;
  emoji: string;
}

interface Bundle {
  id: string;
  title: string;
  description: string;
  items: BundleItem[];
  totalPrice: string;
  bundlePrice: string;
  savings: string;
  popular?: boolean;
  occasion?: string;
}

const SMART_BUNDLES: Bundle[] = [
  {
    id: "abaya-tailor",
    title: "Abaya + Tailoring Bundle",
    description: "Buy a premium abaya and get it tailored to your exact measurements",
    items: [
      { type: "product", name: "Premium Nida Abaya", price: "£65", seller: "Al-Noor Abayas", rating: 4.9, emoji: "👗" },
      { type: "service", name: "Custom Tailoring Session", price: "£25", seller: "Madinah Tailors", rating: 4.8, emoji: "✂️" },
    ],
    totalPrice: "£90",
    bundlePrice: "£75",
    savings: "£15",
    popular: true,
    occasion: "Modest Fashion",
  },
  {
    id: "hijama-aftercare",
    title: "Hijama + Aftercare Bundle",
    description: "Full hijama session with premium aftercare oils and recovery kit",
    items: [
      { type: "service", name: "Full Hijama Session", price: "£55", seller: "Al-Shifa Clinic", rating: 5.0, emoji: "🩺" },
      { type: "product", name: "Black Seed Aftercare Oil", price: "£18", seller: "Sunnah Wellness", rating: 4.7, emoji: "🌿" },
    ],
    totalPrice: "£73",
    bundlePrice: "£60",
    savings: "£13",
    occasion: "Health & Wellness",
  },
  {
    id: "quran-tutor",
    title: "Quran + Tutor Bundle",
    description: "Beautiful Quran with 4 personalised Quran lessons for beginners",
    items: [
      { type: "product", name: "Tajweed Quran (Large Print)", price: "£22", seller: "Islamic Books UK", rating: 4.8, emoji: "📖" },
      { type: "service", name: "4x Quran Lessons (1hr each)", price: "£80", seller: "Ustadha Maryam", rating: 5.0, emoji: "📚" },
    ],
    totalPrice: "£102",
    bundlePrice: "£85",
    savings: "£17",
    popular: true,
    occasion: "Education",
  },
  {
    id: "henna-outfit",
    title: "Henna + Outfit Bundle",
    description: "Perfect for Eid — a stunning modest outfit with professional henna",
    items: [
      { type: "product", name: "Eid Kaftan Set", price: "£55", seller: "Modest Luxe", rating: 4.6, emoji: "👘" },
      { type: "service", name: "Bridal Henna Design", price: "£45", seller: "Henna by Zara", rating: 4.9, emoji: "🌸" },
    ],
    totalPrice: "£100",
    bundlePrice: "£82",
    savings: "£18",
    occasion: "Eid",
  },
];

export default function SmartBundles() {
  const [addedBundles, setAddedBundles] = useState<Set<string>>(new Set());

  const handleAddBundle = (id: string) => {
    setAddedBundles((prev) => { const next = new Set(prev); next.add(id); return next; });
    setTimeout(() => {
      setAddedBundles((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900">Smart Bundles</h2>
            </div>
            <p className="text-gray-500 text-sm">
              Curated product + service combinations — save more, get more.
            </p>
          </div>
          <Link href="/products?bundles=true">
            <button className="flex items-center gap-1.5 text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors">
              View All Bundles
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {SMART_BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex gap-1.5">
                    {bundle.popular && (
                      <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                    {bundle.occasion && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {bundle.occasion}
                      </span>
                    )}
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                    Save {bundle.savings}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900">{bundle.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{bundle.description}</p>
              </div>

              {/* Bundle Items */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  {bundle.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${
                          item.type === "product" ? "bg-blue-50" : "bg-purple-50"
                        }`}
                      >
                        {item.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded ${
                              item.type === "product"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-purple-50 text-purple-600"
                            }`}
                          >
                            {item.type === "product" ? "Product" : "Service"}
                          </span>
                          <span className="text-xs text-gray-400">{item.seller}</span>
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="text-xs text-gray-500">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-200 pt-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        Individually: <span className="line-through">{bundle.totalPrice}</span>
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        Bundle: {bundle.bundlePrice}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddBundle(bundle.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        addedBundles.has(bundle.id)
                          ? "bg-green-500 text-white"
                          : "bg-amber-500 text-white hover:bg-amber-600"
                      }`}
                    >
                      {addedBundles.has(bundle.id) ? (
                        <>
                          <Check className="w-4 h-4" />
                          Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Bundle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
