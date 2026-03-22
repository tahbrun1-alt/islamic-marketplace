import { Shield, CheckCircle, Award, Star, Heart, Globe } from "lucide-react";

interface BadgeProps {
  type: "halal-verified" | "trusted-seller" | "muslim-owned" | "top-rated" | "charity-partner" | "uk-registered";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const BADGE_CONFIG = {
  "halal-verified": {
    label: "Halal Verified",
    icon: Shield,
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
    description: "Products and services verified as halal-compliant by our standards team",
  },
  "trusted-seller": {
    label: "Trusted Seller",
    icon: CheckCircle,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
    description: "Seller has maintained a 4.8+ rating with 50+ verified reviews",
  },
  "muslim-owned": {
    label: "Muslim-Owned",
    icon: Heart,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    description: "Business is owned and operated by a Muslim entrepreneur",
  },
  "top-rated": {
    label: "Top Rated",
    icon: Star,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    description: "Consistently rated 5 stars by the Noor community",
  },
  "charity-partner": {
    label: "Charity Partner",
    icon: Globe,
    color: "text-teal-700",
    bg: "bg-teal-50",
    border: "border-teal-200",
    description: "Donates a portion of every sale to Islamic charities",
  },
  "uk-registered": {
    label: "UK Registered",
    icon: Award,
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
    description: "Verified UK-registered business with Companies House",
  },
};

export function TrustBadge({ type, size = "md", showLabel = true }: BadgeProps) {
  const config = BADGE_CONFIG[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizes = { sm: "w-3 h-3", md: "w-3.5 h-3.5", lg: "w-4 h-4" };

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${config.border} ${config.color} ${sizeClasses[size]}`}
      title={config.description}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && config.label}
    </span>
  );
}

interface TrustBadgesRowProps {
  badges: BadgeProps["type"][];
  size?: BadgeProps["size"];
}

export function TrustBadgesRow({ badges, size = "sm" }: TrustBadgesRowProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {badges.map((badge) => (
        <TrustBadge key={badge} type={badge} size={size} />
      ))}
    </div>
  );
}

export function TrustBadgesSection() {
  return (
    <section className="py-10 bg-white border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Our Trust Standards</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">
            Every seller and product on Noor Marketplace is held to rigorous Islamic ethical and legal standards.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(Object.keys(BADGE_CONFIG) as BadgeProps["type"][]).map((type) => {
            const config = BADGE_CONFIG[type];
            const Icon = config.icon;
            return (
              <div
                key={type}
                className={`flex flex-col items-center text-center p-4 rounded-xl border ${config.bg} ${config.border}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${config.bg}`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <p className={`text-xs font-semibold ${config.color} mb-1`}>{config.label}</p>
                <p className="text-xs text-gray-500 leading-tight">{config.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default TrustBadge;
