import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Search, ShoppingBag, Store, CreditCard, Package, Shield, Star } from "lucide-react";
import { Link } from "wouter";

const categories = [
  {
    icon: <ShoppingBag className="w-5 h-5" />,
    title: "Buying",
    faqs: [
      { q: "How do I place an order?", a: "Browse products or services, add items to your cart, and proceed to checkout. You'll need to create an account or log in, then enter your delivery address and payment details. All payments are processed securely via Stripe." },
      { q: "What payment methods are accepted?", a: "We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and Google Pay — all processed securely by Stripe. We do not accept cash or bank transfers directly." },
      { q: "How do I track my order?", a: "Once your order is dispatched, you'll receive a shipping confirmation email with tracking details. You can also view order status in My Account → Orders." },
      { q: "Can I cancel an order?", a: "You can cancel an order before it is dispatched by contacting the seller via our messaging system. Once dispatched, you'll need to follow our Returns Policy. You always have a 14-day cooling-off right under UK law." },
      { q: "Is everything on Noor Marketplace halal-certified?", a: "Sellers are required to declare whether their products are halal and provide certification where applicable. Look for the 'Halal Verified' badge on listings. If you're unsure, message the seller directly before purchasing." },
    ],
  },
  {
    icon: <Store className="w-5 h-5" />,
    title: "Selling",
    faqs: [
      { q: "How do I start selling on Noor?", a: "Create an account, go to Seller Dashboard, and set up your shop. You'll need to provide your shop name, description, and connect a Stripe account to receive payouts. The process takes about 10 minutes." },
      { q: "What is the commission rate?", a: "Noor Marketplace charges a 7% commission on each sale. Of this, 6.5% goes to platform operations and 0.5% is automatically donated to verified Islamic charities. There are no listing fees or monthly subscriptions." },
      { q: "How do I import products from my existing website?", a: "In your Seller Dashboard, click 'Import from URL'. Paste your product page URL and our AI will automatically extract the product name, description, price, and images. You can then review and edit before publishing." },
      { q: "When do I get paid?", a: "Payouts are processed weekly via Stripe. Funds are typically available in your bank account within 2–5 business days after the payout is initiated. You can view your payout history in the Seller Dashboard." },
      { q: "What items are prohibited?", a: "We prohibit: alcohol, pork products, non-halal meat, gambling-related items, adult content, weapons, counterfeit goods, and anything prohibited under UK law or Islamic principles. Violations result in immediate account suspension." },
    ],
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Payments",
    faqs: [
      { q: "Is my payment information secure?", a: "Yes. All payments are processed by Stripe, which is PCI-DSS Level 1 certified — the highest level of payment security. We never store your card details on our servers." },
      { q: "Why was my payment declined?", a: "Common reasons include: incorrect card details, insufficient funds, card expired, or your bank blocking the transaction. Try a different card or contact your bank. If the issue persists, contact our support team." },
      { q: "How do refunds work?", a: "Approved refunds are returned to your original payment method within 14 days. The exact time depends on your bank — typically 3–5 business days after we process the refund." },
      { q: "Is there interest (riba) involved?", a: "No. Noor Marketplace does not charge or facilitate any interest-based transactions. Our commission is a straightforward service fee, not a loan or credit arrangement." },
    ],
  },
  {
    icon: <Package className="w-5 h-5" />,
    title: "Delivery",
    faqs: [
      { q: "How long does delivery take?", a: "Delivery times vary by seller and are shown on each product listing. Most UK sellers offer 3–7 business day standard delivery. International delivery typically takes 7–21 business days." },
      { q: "Do you deliver internationally?", a: "Yes — sellers can choose to ship internationally. Check the product listing for available shipping destinations. Import duties and taxes for international orders are the buyer's responsibility." },
      { q: "What if my item doesn't arrive?", a: "If your item hasn't arrived within the estimated delivery window, first check your tracking information. If there's no update, contact the seller via our messaging system. If unresolved, open a dispute within 30 days of the expected delivery date." },
    ],
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Account & Safety",
    faqs: [
      { q: "How do I reset my password?", a: "Click 'Forgot password' on the login page and enter your email address. You'll receive a reset link within a few minutes. Check your spam folder if you don't see it." },
      { q: "How do I report a suspicious seller?", a: "Click the 'Report' button on the seller's shop page or product listing. Our team reviews all reports within 24 hours. You can also email trust@noormarketplace.com." },
      { q: "How do I delete my account?", a: "Go to Account Settings → Privacy → Delete Account. Note that we retain transaction records for 7 years as required by UK tax law, but your personal profile data will be removed." },
      { q: "Is my personal data shared with sellers?", a: "We share only the information necessary to fulfil your order: your name and delivery address. We never share your email, phone number, or payment details with sellers." },
    ],
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Reviews & Ratings",
    faqs: [
      { q: "How do reviews work?", a: "After receiving an order, you'll be invited to leave a review. Reviews must be honest and based on your genuine experience. We do not allow incentivised or fake reviews." },
      { q: "Can a seller remove my review?", a: "No. Sellers cannot remove reviews. Only Noor Marketplace can remove reviews that violate our community guidelines (e.g. offensive language, false information)." },
      { q: "What if I receive a fake or non-halal item?", a: "This is a serious violation. Open a dispute immediately, provide photographic evidence, and our team will investigate. Confirmed violations result in full refunds and seller suspension." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-cream-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-cream-50 transition-colors"
      >
        <span className="font-semibold text-ink-800 pr-4">{q}</span>
        {open ? <ChevronUp className="w-5 h-5 text-gold-600 shrink-0" /> : <ChevronDown className="w-5 h-5 text-ink-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-ink-600 text-sm leading-relaxed border-t border-cream-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = categories.map(cat => ({
    ...cat,
    faqs: cat.faqs.filter(faq =>
      !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter(cat => !search || cat.faqs.length > 0);

  const displayed = activeCategory ? filtered.filter(c => c.title === activeCategory) : filtered;

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-ink-900 text-white py-16">
        <div className="container text-center">
          <HelpCircle className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-3">Help Centre</h1>
          <p className="text-white/70 max-w-xl mx-auto mb-8">Find answers to common questions about buying, selling, and using Noor Marketplace.</p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-ink-800 placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>
      </div>

      <div className="container py-12 max-w-4xl">
        {/* Category pills */}
        {!search && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!activeCategory ? "bg-gold-600 text-white" : "bg-white text-ink-600 border border-cream-300 hover:border-gold-400"}`}
            >
              All Topics
            </button>
            {categories.map(cat => (
              <button
                key={cat.title}
                onClick={() => setActiveCategory(cat.title === activeCategory ? null : cat.title)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeCategory === cat.title ? "bg-gold-600 text-white" : "bg-white text-ink-600 border border-cream-300 hover:border-gold-400"}`}
              >
                {cat.icon}
                {cat.title}
              </button>
            ))}
          </div>
        )}

        {/* FAQ sections */}
        <div className="space-y-8">
          {displayed.map(cat => (
            <div key={cat.title}>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-gold-600">{cat.icon}</div>
                <h2 className="font-serif text-xl font-bold text-ink-800">{cat.title}</h2>
              </div>
              <div className="space-y-2">
                {cat.faqs.map(faq => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
              </div>
            </div>
          ))}
          {displayed.length === 0 && (
            <div className="text-center py-12 text-ink-500">
              <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No results found for "{search}"</p>
              <p className="text-sm mt-1">Try different keywords or <Link href="/contact" className="text-gold-600 hover:underline">contact us</Link> directly.</p>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="mt-12 bg-white rounded-2xl border border-cream-200 p-8 text-center">
          <h3 className="font-serif text-2xl font-bold text-ink-800 mb-2">Still need help?</h3>
          <p className="text-ink-500 mb-6">Our support team is available Monday–Friday, 9am–6pm GMT.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="bg-gold-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gold-700 transition-colors">
              Contact Support
            </Link>
            <Link href="/disputes" className="bg-cream-100 text-ink-700 px-6 py-3 rounded-xl font-semibold hover:bg-cream-200 transition-colors">
              Open a Dispute
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
