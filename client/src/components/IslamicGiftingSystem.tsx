import React from "react";
import { useState } from "react";
import { Gift, Heart, Star, ChevronRight, Plus, Minus, Check, Moon, Sparkles, Baby, MapPin, GraduationCap, Leaf, Circle } from "lucide-react";
import { Link } from "wouter";

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

interface GiftBundle {
  id: string;
  name: string;
  occasion: string;
  price: string;
  originalPrice?: string;
  items: string[];
  Icon: React.ElementType;
  popular?: boolean;
  charity?: string;
}

const GIFT_BUNDLES: GiftBundle[] = [
  {
    id: "ramadan-essentials",
    name: "Ramadan Essentials Box",
    occasion: "Ramadan",
    price: "£45",
    originalPrice: "£62",
    items: ["Premium Medjool Dates (500g)", "Prayer Mat", "Tasbih Beads", "Ramadan Planner", "Attar Perfume"],
    Icon: Moon,
    popular: true,
    charity: "Donates £2 to Islamic Relief",
  },
  {
    id: "eid-gift-box",
    name: "Eid Celebration Box",
    occasion: "Eid",
    price: "£35",
    items: ["Eid Card", "Luxury Sweets Box", "Henna Kit", "Eid Mubarak Decoration"],
    Icon: Sparkles,
    charity: "Donates £1.75 to Human Appeal",
  },
  {
    id: "new-baby",
    name: "New Baby Islamic Gift",
    occasion: "New Baby",
    price: "£55",
    items: ["Silver Aqiqah Frame", "Islamic Baby Book", "Soft Prayer Mat", "Bismillah Wall Art", "Organic Baby Dates"],
    Icon: Baby,
    popular: true,
  },
  {
    id: "nikah-gift",
    name: "Nikah Blessing Bundle",
    occasion: "Nikah / Wedding",
    price: "£75",
    originalPrice: "£95",
    items: ["Quran Set (His & Hers)", "Luxury Attar Duo", "Islamic Home Decor", "Dua Cards", "Dates & Sweets"],
    Icon: Ring,
    charity: "Donates £3.75 to Muslim Aid",
  },
  {
    id: "hajj-prep",
    name: "Hajj Preparation Kit",
    occasion: "Hajj / Umrah",
    price: "£65",
    items: ["Ihram Set", "Travel Dua Book", "Zamzam Bottle", "Prayer Beads", "Hajj Journal"],
    Icon: MapPin,
  },
  {
    id: "graduation",
    name: "Islamic Graduate Gift",
    occasion: "Graduation",
    price: "£40",
    items: ["Personalised Quran", "Islamic Success Journal", "Dua for Knowledge Card", "Attar Perfume"],
    Icon: GraduationCap,
  },
];

const OCCASIONS = ["All", "Ramadan", "Eid", "New Baby", "Nikah / Wedding", "Hajj / Umrah", "Graduation"];

interface GiftCardBuilderProps {
  onClose: () => void;
}

function GiftCardBuilder({ onClose }: GiftCardBuilderProps) {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [selectedDesign, setSelectedDesign] = useState(0);

  const designs = [
    { Icon: Moon, label: "Ramadan" },
    { Icon: Sparkles, label: "Eid" },
    { Icon: MapPin, label: "Hajj" },
    { Icon: Heart, label: "Islamic" },
    { Icon: Leaf, label: "Floral" },
    { Icon: Circle, label: "Classic" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Add a Gift Message</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient's name"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Card Design</label>
          <div className="flex gap-2 flex-wrap">
            {designs.map((d, i) => (
              <button
                key={i}
                onClick={() => setSelectedDesign(i)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-lg transition-all ${
                  selectedDesign === i ? "border-amber-500 bg-amber-50" : "border-gray-200"
                }`}
              >
                <d.Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your heartfelt message... e.g. Ramadan Mubarak! May Allah bless you and your family."
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">{message.length}/200 characters</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-amber-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            Add to Gift
          </button>
        </div>
      </div>
    </div>
  );
}

export default function IslamicGiftingSystem() {
  const [selectedOccasion, setSelectedOccasion] = useState("All");
  const [showGiftCard, setShowGiftCard] = useState(false);
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const filteredBundles =
    selectedOccasion === "All"
      ? GIFT_BUNDLES
      : GIFT_BUNDLES.filter((b) => b.occasion === selectedOccasion);

  const handleAddBundle = (id: string) => {
    setAddedItems((prev) => { const next = new Set(prev); next.add(id); return next; });
    setTimeout(() => {
      setAddedItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  return (
    <section className="py-12 bg-gradient-to-b from-rose-50 to-white">
      {showGiftCard && <GiftCardBuilder onClose={() => setShowGiftCard(false)} />}

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-900">Islamic Gifting</h2>
          </div>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Thoughtfully curated halal gift bundles for every Islamic occasion — with optional charity donations and personalised messages.
          </p>
        </div>

        {/* Gift Card Builder CTA */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white">
            <p className="font-bold text-lg">Add a Gift Message</p>
            <p className="text-white/80 text-sm">Personalise any order with a beautiful Islamic e-card</p>
          </div>
          <button
            onClick={() => setShowGiftCard(true)}
            className="bg-white text-rose-600 font-semibold px-6 py-2.5 rounded-full hover:bg-rose-50 transition-colors text-sm whitespace-nowrap"
          >
            Create Gift Card
          </button>
        </div>

        {/* Occasion Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {OCCASIONS.map((occ) => (
            <button
              key={occ}
              onClick={() => setSelectedOccasion(occ)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedOccasion === occ
                  ? "bg-rose-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-rose-300"
              }`}
            >
              {occ}
            </button>
          ))}
        </div>

        {/* Bundles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBundles.map((bundle) => (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl"><bundle.Icon className="w-5 h-5" /></span>
                  <div className="flex gap-1.5">
                    {bundle.popular && (
                      <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                    <span className="text-xs bg-rose-100 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full font-medium">
                      {bundle.occasion}
                    </span>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900">{bundle.name}</h3>
              </div>

              {/* Items */}
              <div className="p-4">
                <ul className="space-y-1 mb-3">
                  {bundle.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {bundle.charity && (
                  <p className="text-xs text-teal-600 bg-teal-50 rounded-lg px-3 py-1.5 mb-3">
                    {bundle.charity}
                  </p>
                )}

                {/* Price & CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-gray-900">{bundle.price}</span>
                    {bundle.originalPrice && (
                      <span className="text-sm text-gray-400 line-through ml-2">{bundle.originalPrice}</span>
                    )}
                  </div>
                  <button
                    onClick={() => handleAddBundle(bundle.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      addedItems.has(bundle.id)
                        ? "bg-green-500 text-white"
                        : "bg-rose-500 text-white hover:bg-rose-600"
                    }`}
                  >
                    {addedItems.has(bundle.id) ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added!
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        Add Gift
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Link href="/products?category=gifts">
            <button className="inline-flex items-center gap-2 text-rose-600 font-medium hover:text-rose-700 transition-colors">
              View All Gift Collections
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
