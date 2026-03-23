import { useState } from "react";
import { useLocation } from "wouter";
import {
  Store,
  Upload,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  Phone,
  MapPin,
  Clock,
  Star,
  Shield,
  ChevronRight,
  Package,
  Scissors,
  Utensils,
  BookOpen,
  Shirt,
  Heart,
} from "lucide-react";

const BUSINESS_CATEGORIES = [
  { id: "food", label: "Halal Food & Catering", icon: Utensils },
  { id: "fashion", label: "Modest Fashion & Abayas", icon: Shirt },
  { id: "services", label: "Islamic Services", icon: Heart },
  { id: "beauty", label: "Halal Beauty & Wellness", icon: Star },
  { id: "education", label: "Tutoring & Education", icon: BookOpen },
  { id: "tailoring", label: "Tailoring & Alterations", icon: Scissors },
  { id: "products", label: "Islamic Products", icon: Package },
  { id: "other", label: "Other Muslim Business", icon: Store },
];

const STEPS = [
  { id: 1, title: "Business Type", description: "What do you sell?" },
  { id: 2, title: "Your Details", description: "Tell us about you" },
  { id: 3, title: "Business Info", description: "Shop details" },
  { id: 4, title: "Go Live", description: "You're ready!" },
];

export default function SellerOnboarding() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    businessName: "",
    location: "",
    description: "",
    openingHours: "",
    acceptsLocalPickup: false,
    acceptsDelivery: false,
    isHalalCertified: false,
    isMuslimOwned: true,
  });

  const updateForm = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    navigate("/seller-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">ن</span>
            </div>
            <span className="font-bold text-gray-900">Noor Marketplace</span>
          </div>
          <span className="text-sm text-gray-500">Seller Onboarding</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s.id
                      ? "bg-green-500 text-white"
                      : step === s.id
                      ? "bg-amber-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > s.id ? <CheckCircle className="w-4 h-4" /> : s.id}
                </div>
                <p className="text-xs text-gray-500 mt-1 hidden sm:block">{s.title}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 transition-all ${
                    step > s.id ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Business Type */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">What do you sell?</h1>
              <p className="text-gray-500 text-sm">
                Choose the category that best describes your business. You can add more later.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {BUSINESS_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      selectedCategory === cat.id
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 bg-white hover:border-amber-300"
                    }`}
                  >
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="text-sm font-medium text-gray-900 leading-tight">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Details</h1>
              <p className="text-gray-500 text-sm">
                We need a few details to set up your seller account.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="e.g. Fatima Al-Hassan"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                    🇬🇧 +44
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="07700 900000"
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">We'll send a WhatsApp verification code</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Business Info */}
        {step === 3 && (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Business</h1>
              <p className="text-gray-500 text-sm">
                Tell buyers about your shop. The more detail, the more trust.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business / Shop Name *</label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) => updateForm("businessName", e.target.value)}
                  placeholder="e.g. Al-Noor Abayas"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline w-3.5 h-3.5 mr-1" />
                  Location (City / Area)
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  placeholder="e.g. East London, UK"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Tell buyers what makes your business special..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Fulfilment Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fulfilment Options</label>
                <div className="space-y-2">
                  {[
                    { key: "acceptsLocalPickup", label: "Local Pickup", icon: "pin" },
                    { key: "acceptsDelivery", label: "Delivery / Shipping", icon: "delivery" },
                  ].map((opt) => (
                    <label key={opt.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[opt.key as keyof typeof formData] as boolean}
                        onChange={(e) => updateForm(opt.key, e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span className="text-sm text-gray-700">
                        <opt.Icon className="w-4 h-4" /> {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trust Badges</label>
                <div className="space-y-2">
                  {[
                    { key: "isMuslimOwned", label: "Muslim-Owned Business", icon: "verified" },
                    { key: "isHalalCertified", label: "Halal Certified Products/Services", icon: "halal" },
                  ].map((opt) => (
                    <label key={opt.key} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData[opt.key as keyof typeof formData] as boolean}
                        onChange={(e) => updateForm(opt.key, e.target.checked)}
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span className="text-sm text-gray-700">
                        <opt.Icon className="w-4 h-4" /> {opt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Go Live */}
        {step === 4 && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h1>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Welcome to the Noor Marketplace community. Your shop is being reviewed and will go live within 24 hours.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-amber-900 mb-3">Next Steps:</h3>
              <div className="space-y-2">
                {[
                  "Add your first product or service listing",
                  "Upload photos of your products",
                  "Set your pricing and delivery options",
                  "Share your shop link with your community",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-amber-800">
                    <div className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-700">
                      {i + 1}
                    </div>
                    {step}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/product-form")}
                className="flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                <Package className="w-4 h-4" />
                Add First Product
              </button>
              <button
                onClick={() => navigate("/seller-dashboard")}
                className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <Store className="w-4 h-4" />
                View Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={step === 1 && !selectedCategory}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === 3 ? "Submit & Go Live" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Trust Footer */}
        <div className="flex items-center justify-center gap-4 mt-8 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            Secure & Private
          </span>
          <span>•</span>
          <span>Free to join</span>
          <span>•</span>
          <span>No monthly fees</span>
        </div>
      </div>
    </div>
  );
}
