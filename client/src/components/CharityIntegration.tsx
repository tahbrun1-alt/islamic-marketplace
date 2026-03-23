import { useState } from "react";
import { Heart, Globe, TrendingUp, ChevronRight, Check } from "lucide-react";
import { Link } from "wouter";

interface Charity {
  id: string;
  name: string;
  logo: string;
  description: string;
  cause: string;
  totalRaised: string;
  donors: number;
  verified: boolean;
}

const CHARITIES: Charity[] = [
  {
    id: "islamic-relief",
    name: "Islamic Relief UK",
    logo: "IR",
    description: "Emergency aid, water, education and sustainable development worldwide.",
    cause: "Global Aid",
    totalRaised: "£12,450",
    donors: 847,
    verified: true,
  },
  {
    id: "human-appeal",
    name: "Human Appeal",
    logo: "MA",
    description: "Providing clean water, food and shelter to those in need.",
    cause: "Water & Food",
    totalRaised: "£8,320",
    donors: 612,
    verified: true,
  },
  {
    id: "muslim-aid",
    name: "Muslim Aid",
    logo: "PA",
    description: "Healthcare, education and emergency relief for vulnerable communities.",
    cause: "Healthcare",
    totalRaised: "£6,180",
    donors: 423,
    verified: true,
  },
  {
    id: "penny-appeal",
    name: "Penny Appeal",
    logo: "HB",
    description: "Tackling poverty and transforming lives across the Muslim world.",
    cause: "Poverty Relief",
    totalRaised: "£4,950",
    donors: 318,
    verified: true,
  },
];

const DONATION_PERCENTAGES = [1, 2, 5, 10];

interface CharityCheckoutProps {
  orderTotal: number;
  onSelect: (charityId: string | null, percentage: number) => void;
}

export function CharityCheckout({ orderTotal, onSelect }: CharityCheckoutProps) {
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null);
  const [selectedPercentage, setSelectedPercentage] = useState(2);
  const [enabled, setEnabled] = useState(false);

  const donationAmount = enabled && selectedCharity
    ? ((orderTotal * selectedPercentage) / 100).toFixed(2)
    : "0.00";

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    if (!newEnabled) {
      onSelect(null, 0);
    } else if (selectedCharity) {
      onSelect(selectedCharity, selectedPercentage);
    }
  };

  return (
    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-teal-600" />
          <span className="font-semibold text-teal-900 text-sm">Round up for charity (Sadaqah)</span>
        </div>
        <button
          onClick={handleToggle}
          className={`w-10 h-5 rounded-full transition-colors relative ${enabled ? "bg-teal-500" : "bg-gray-300"}`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              enabled ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {enabled && (
        <>
          <div className="flex gap-2 mb-3 flex-wrap">
            {DONATION_PERCENTAGES.map((pct) => (
              <button
                key={pct}
                onClick={() => {
                  setSelectedPercentage(pct);
                  if (selectedCharity) onSelect(selectedCharity, pct);
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  selectedPercentage === pct
                    ? "bg-teal-600 text-white"
                    : "bg-white text-teal-700 border border-teal-200"
                }`}
              >
                {pct}% (£{((orderTotal * pct) / 100).toFixed(2)})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {CHARITIES.map((charity) => (
              <button
                key={charity.id}
                onClick={() => {
                  setSelectedCharity(charity.id);
                  onSelect(charity.id, selectedPercentage);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                  selectedCharity === charity.id
                    ? "border-teal-500 bg-teal-100"
                    : "border-gray-200 bg-white hover:border-teal-300"
                }`}
              >
                <span className="text-lg">{charity.logo}</span>
                <div>
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{charity.name}</p>
                  <p className="text-xs text-gray-500">{charity.cause}</p>
                </div>
                {selectedCharity === charity.id && (
                  <Check className="w-3.5 h-3.5 text-teal-600 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {selectedCharity && (
            <p className="text-xs text-teal-700 bg-teal-100 rounded-lg px-3 py-1.5">
              £{donationAmount} will be donated to{" "}
              {CHARITIES.find((c) => c.id === selectedCharity)?.name}. Jazakallah Khair!
            </p>
          )}
        </>
      )}
    </div>
  );
}

export function CharityImpactSection() {
  const totalRaised = "£31,900";
  const totalDonors = 2200;

  return (
    <section className="py-12 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Globe className="w-6 h-6 text-teal-600" />
            <h2 className="text-2xl font-bold text-gray-900">Our Sadaqah Impact</h2>
          </div>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Every purchase on Noor Marketplace can include a Sadaqah donation. Together, our community has raised over{" "}
            <strong className="text-teal-700">{totalRaised}</strong> for Islamic charities.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-teal-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-teal-700">{totalRaised}</p>
            <p className="text-xs text-gray-500 mt-1">Total Raised</p>
          </div>
          <div className="bg-white rounded-xl border border-teal-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-teal-700">{totalDonors.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Generous Donors</p>
          </div>
          <div className="bg-white rounded-xl border border-teal-100 p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-teal-700">4</p>
            <p className="text-xs text-gray-500 mt-1">Partner Charities</p>
          </div>
        </div>

        {/* Charity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CHARITIES.map((charity) => (
            <div
              key={charity.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{charity.logo}</span>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{charity.name}</p>
                  <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full">
                    {charity.cause}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{charity.description}</p>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-teal-700">{charity.totalRaised}</p>
                  <p className="text-gray-400">raised via Noor</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-700">{charity.donors}</p>
                  <p className="text-gray-400">donors</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 mb-3">
            Enable Sadaqah donations at checkout — every penny counts.
          </p>
          <Link href="/products">
            <button className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-teal-700 transition-colors">
              <Heart className="w-4 h-4" />
              Shop & Give
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CharityImpactSection;
