import { useState } from "react";
import {
  TrendingUp,
  Share2,
  Copy,
  Check,
  Star,
  Zap,
  BarChart2,
  Gift,
  Tag,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface MarketingTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  action: string;
  badge?: string;
}

const MARKETING_TOOLS: MarketingTool[] = [
  {
    id: "share-link",
    title: "Share Your Shop",
    description: "Get your unique shop link to share on WhatsApp, Instagram & social media",
    icon: Share2,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    action: "Copy Link",
  },
  {
    id: "promotions",
    title: "Run a Promotion",
    description: "Create discount codes and seasonal offers for Ramadan, Eid & more",
    icon: Tag,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    action: "Create Offer",
    badge: "Popular",
  },
  {
    id: "boost",
    title: "Boost Listing",
    description: "Feature your products at the top of search results for 7 days",
    icon: Zap,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    action: "Boost Now",
    badge: "New",
  },
  {
    id: "analytics",
    title: "View Analytics",
    description: "Track views, clicks, conversions and revenue in real-time",
    icon: BarChart2,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    action: "View Stats",
  },
  {
    id: "gift-card",
    title: "Offer Gift Cards",
    description: "Let customers buy gift cards for your shop — great for Eid",
    icon: Gift,
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    action: "Enable",
    badge: "Eid Ready",
  },
  {
    id: "reviews",
    title: "Request Reviews",
    description: "Send automated review requests to your happy customers",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    action: "Set Up",
  },
];

interface ShareLinkModalProps {
  shopName: string;
  shopId: string;
  onClose: () => void;
}

function ShareLinkModal({ shopName, shopId, onClose }: ShareLinkModalProps) {
  const [copied, setCopied] = useState(false);
  const shopUrl = `https://noormarketplace.com/sellers/${shopId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shopUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareOptions = [
    { label: "WhatsApp", emoji: "💬", url: `https://wa.me/?text=${encodeURIComponent(`Check out my shop on Noor Marketplace! ${shopUrl}`)}` },
    { label: "Instagram", emoji: "📸", url: "#" },
    { label: "Facebook", emoji: "👥", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shopUrl)}` },
    { label: "Twitter/X", emoji: "🐦", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Shop halal on Noor Marketplace! ${shopUrl}`)}` },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Share Your Shop</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2 mb-4">
          <p className="text-sm text-gray-600 flex-1 truncate">{shopUrl}</p>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              copied ? "bg-green-500 text-white" : "bg-amber-500 text-white hover:bg-amber-600"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {shareOptions.map((opt) => (
            <a
              key={opt.label}
              href={opt.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">{opt.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{opt.label}</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 ml-auto" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SellerMarketingToolsProps {
  shopId?: string;
  shopName?: string;
  compact?: boolean;
}

export default function SellerMarketingTools({
  shopId = "my-shop",
  shopName = "My Shop",
  compact = false,
}: SellerMarketingToolsProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeTools, setActiveTools] = useState<Set<string>>(new Set());

  const handleToolAction = (toolId: string) => {
    if (toolId === "share-link") {
      setShowShareModal(true);
    } else {
      setActiveTools((prev) => { const next = new Set(prev); next.add(toolId); return next; });
    }
  };

  return (
    <div>
      {showShareModal && (
        <ShareLinkModal
          shopId={shopId}
          shopName={shopName}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {compact ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MARKETING_TOOLS.slice(0, 6).map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => handleToolAction(tool.id)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-sm transition-all ${tool.bgColor}`}
              >
                <Icon className={`w-5 h-5 ${tool.color}`} />
                <span className="text-xs font-medium text-gray-700 text-center">{tool.title}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKETING_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tool.bgColor}`}>
                    <Icon className={`w-5 h-5 ${tool.color}`} />
                  </div>
                  {tool.badge && (
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{tool.title}</h3>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{tool.description}</p>
                <button
                  onClick={() => handleToolAction(tool.id)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${tool.color} hover:opacity-80`}
                >
                  {tool.action}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
