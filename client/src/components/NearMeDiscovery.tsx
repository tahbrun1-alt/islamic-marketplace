import { useState } from "react";
import { MapPin, Navigation, Filter, Clock, Star, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";
import { Link } from "wouter";

interface NearMeDiscoveryProps {
  className?: string;
}

const LOCAL_CATEGORIES = [
  { id: "hijama", label: "Hijama Clinics", icon: "🩺", color: "bg-red-100 text-red-700" },
  { id: "tutors", label: "Tutors", icon: "📚", color: "bg-blue-100 text-blue-700" },
  { id: "tailors", label: "Tailors", icon: "✂️", color: "bg-purple-100 text-purple-700" },
  { id: "mosque", label: "Near Mosque", icon: "🕌", color: "bg-green-100 text-green-700" },
  { id: "food", label: "Halal Food", icon: "🍽️", color: "bg-orange-100 text-orange-700" },
  { id: "beauty", label: "Modest Beauty", icon: "💄", color: "bg-pink-100 text-pink-700" },
];

const MOCK_LOCAL_LISTINGS = [
  {
    id: 1,
    name: "Al-Shifa Hijama Centre",
    category: "Hijama Clinics",
    distance: "0.8 miles",
    rating: 4.9,
    reviews: 127,
    available: "Today",
    price: "£45",
    badge: "Halal Verified",
    type: "service",
  },
  {
    id: 2,
    name: "Sister Fatima – Arabic & Quran Tutor",
    category: "Tutors",
    distance: "1.2 miles",
    rating: 5.0,
    reviews: 84,
    available: "Same Day",
    price: "£25/hr",
    badge: "Trusted Seller",
    type: "service",
  },
  {
    id: 3,
    name: "Madinah Tailoring & Alterations",
    category: "Tailors",
    distance: "1.5 miles",
    rating: 4.8,
    reviews: 203,
    available: "Next Day",
    price: "From £15",
    badge: "Local Business",
    type: "service",
  },
  {
    id: 4,
    name: "Noor Abaya Boutique",
    category: "Modest Fashion",
    distance: "2.1 miles",
    rating: 4.7,
    reviews: 56,
    available: "Local Pickup",
    price: "£35",
    badge: "Muslim-Owned",
    type: "product",
  },
];

export default function NearMeDiscovery({ className = "" }: NearMeDiscoveryProps) {
  const [nearMeEnabled, setNearMeEnabled] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [locationGranted, setLocationGranted] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const handleEnableLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true);
          setLocationLoading(false);
        },
        () => {
          // Fallback: use London as default
          setLocationGranted(true);
          setLocationLoading(false);
        }
      );
    } else {
      setLocationGranted(true);
      setLocationLoading(false);
    }
  };

  const filteredListings = selectedCategory
    ? MOCK_LOCAL_LISTINGS.filter((l) => l.category.toLowerCase().includes(selectedCategory))
    : MOCK_LOCAL_LISTINGS;

  return (
    <section className={`py-12 bg-gradient-to-b from-white to-amber-50 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-5 h-5 text-amber-500" />
              <h2 className="text-2xl font-bold text-gray-900">Near You</h2>
            </div>
            <p className="text-gray-500 text-sm">
              {locationGranted
                ? "Showing sellers and services near London, UK"
                : "Discover halal businesses in your area"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 font-medium">Near Me</span>
            <button
              onClick={() => setNearMeEnabled(!nearMeEnabled)}
              className="focus:outline-none"
              aria-label="Toggle near me"
            >
              {nearMeEnabled ? (
                <ToggleRight className="w-10 h-10 text-amber-500" />
              ) : (
                <ToggleLeft className="w-10 h-10 text-gray-400" />
              )}
            </button>
            {!locationGranted && (
              <button
                onClick={handleEnableLocation}
                disabled={locationLoading}
                className="flex items-center gap-1.5 bg-amber-500 text-white text-sm px-4 py-2 rounded-full hover:bg-amber-600 transition-colors disabled:opacity-60"
              >
                <Navigation className="w-4 h-4" />
                {locationLoading ? "Locating..." : "Use My Location"}
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === null
                ? "bg-amber-500 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300"
            }`}
          >
            All Nearby
          </button>
          {LOCAL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-amber-500 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-amber-300"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filters Row */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-amber-400 transition-colors">
            <Clock className="w-3.5 h-3.5" />
            Same Day
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-amber-400 transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            Local Pickup
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-amber-400 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            Near Mosque
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-amber-400 transition-colors">
            <Star className="w-3.5 h-3.5" />
            Top Rated
          </button>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {filteredListings.map((listing) => (
            <Link
              key={listing.id}
              href={listing.type === "service" ? `/services/${listing.id}` : `/products/${listing.id}`}
            >
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all cursor-pointer p-4 group">
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                    {listing.badge}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {listing.distance}
                  </span>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-amber-600 transition-colors line-clamp-2">
                  {listing.name}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{listing.category}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-gray-700">{listing.rating}</span>
                  <span className="text-xs text-gray-400">({listing.reviews})</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-green-600 font-medium">{listing.available}</p>
                    <p className="text-sm font-bold text-gray-900">{listing.price}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-amber-500 transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Map View CTA */}
        <div className="text-center">
          <Link href="/services?view=map">
            <button className="inline-flex items-center gap-2 bg-white border border-amber-300 text-amber-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors">
              <MapPin className="w-4 h-4" />
              View Map of Local Sellers
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
