import { Link } from "wouter";
import { Store, Mail, Phone, MapPin, Heart, CheckCircle, Lock, Flag } from "lucide-react";

const footerLinks = {
  "Shop": [
    { label: "All Products", href: "/products" },
    { label: "All Services", href: "/services" },
    { label: "Sellers", href: "/sellers" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Featured", href: "/products?featured=true" },
  ],
  "Sell": [
    { label: "Start Selling", href: "/seller/dashboard" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Seller Dashboard", href: "/seller/dashboard#dashboard" },
    { label: "Commission Info", href: "/how-it-works#commission" },
  ],
  "Support": [
    { label: "Help Centre", href: "/help" },
    { label: "Contact Us", href: "/contact" },
    { label: "Dispute Resolution", href: "/disputes" },
    { label: "Returns Policy", href: "/returns" },
  ],
  "Company": [
    { label: "About Noor", href: "/about" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Halal Standards", href: "/halal-standards" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">ن</div>
              <div>
                <div className="font-bold text-lg leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Noor</div>
                <div className="text-xs opacity-60 leading-tight -mt-0.5">Marketplace</div>
              </div>
            </Link>
            <p className="text-sm opacity-70 leading-relaxed mb-4">
              The global Islamic marketplace for halal products and services. Connecting the Ummah, one transaction at a time.
            </p>
            <div className="space-y-2 text-sm opacity-70">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                <span>hello@noormarketplace.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>London, United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-bold text-sm mb-4 opacity-90">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs opacity-50">
            © {new Date().getFullYear()} Noor Marketplace Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs opacity-50">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
            <span>for the Ummah</span>
          </div>
          <div className="flex items-center gap-4 text-xs opacity-50">
            <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-primary" /> Halal Verified</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> SSL Secured</span>
            <span className="flex items-center gap-1"><Flag className="w-3 h-3" /> UK Based</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
