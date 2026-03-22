import { motion } from "framer-motion";
import { Heart, Globe, Shield, Star, Users, TrendingUp, Award, Handshake } from "lucide-react";
import { Link } from "wouter";

const values = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Halal First",
    desc: "Every product and service on our platform is vetted against Islamic principles. We enforce strict halal standards so you can shop with complete confidence.",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Community & Ummah",
    desc: "We exist to serve the global Muslim community. Every feature, policy, and decision is made with the Ummah's wellbeing at heart.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Ethical Trading",
    desc: "Rooted in the Prophetic tradition of honest commerce, we prohibit deception (gharar), interest (riba), and exploitation in all transactions.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Reach",
    desc: "From London to Lahore, Kuala Lumpur to Cairo — Noor connects Muslim buyers and sellers across the world in one trusted marketplace.",
  },
  {
    icon: <Award className="w-6 h-6" />,
    title: "Transparency",
    desc: "No hidden fees. No surprises. Our 7% commission (including 0.5% charity donation) is the only cost to sellers. Buyers pay no platform fees.",
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Empowering Sellers",
    desc: "We give Muslim entrepreneurs the tools, reach, and support they need to grow thriving halal businesses — from sole traders to established brands.",
  },
];

const stats = [
  { value: "10,000+", label: "Products Listed" },
  { value: "500+", label: "Verified Sellers" },
  { value: "50+", label: "Countries Served" },
  { value: "£50,000+", label: "Donated to Charity" },
];

const milestones = [
  { year: "2024", event: "Noor Marketplace founded in London with a vision to serve the global Ummah." },
  { year: "2025", event: "Platform launched with 100 founding sellers and 1,000 products across 10 categories." },
  { year: "2025", event: "Stripe payments integration and AI-powered product importer launched." },
  { year: "2026", event: "Expanded to 50+ countries, 500+ sellers, and introduced the 0.5% auto-charity donation model." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div
        className="text-white py-20"
        style={{ background: "linear-gradient(135deg, oklch(0.15 0.020 45) 0%, oklch(0.20 0.030 50) 100%)" }}
      >
        <div className="container text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-3xl font-arabic">ن</span>
            </div>
            <h1 className="font-serif text-5xl font-bold mb-4">About Noor Marketplace</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              The global Islamic marketplace connecting the Ummah through halal commerce, ethical trade, and community-first values.
            </p>
            <p className="text-gold-400 font-arabic text-xl mt-4">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gold-600 text-white py-10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-3xl font-bold font-serif">{s.value}</div>
                <div className="text-white/80 text-sm mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-16 max-w-5xl space-y-16">
        {/* Our Story */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8 md:p-12"
        >
          <h2 className="font-serif text-3xl font-bold text-ink-800 mb-6">Our Story</h2>
          <div className="space-y-4 text-ink-600 leading-relaxed">
            <p>
              Noor Marketplace was born from a simple but powerful observation: the global Muslim community — 1.8 billion strong — lacked a dedicated, trustworthy digital marketplace to buy and sell halal products and services. Muslim entrepreneurs were scattered across generic platforms with no halal verification, no Islamic values, and no community connection.
            </p>
            <p>
              Founded in London in 2024, Noor (meaning <em>light</em> in Arabic) set out to change this. We built a platform where every listing is held to Islamic standards, every transaction is transparent, and every seller is treated as a partner rather than a number.
            </p>
            <p>
              Our name reflects our mission: to be a light for the Ummah in the digital economy — illuminating the path to ethical, halal commerce for Muslims everywhere.
            </p>
            <blockquote className="border-l-4 border-gold-500 pl-6 py-2 bg-gold-50 rounded-r-xl">
              <p className="font-serif italic text-ink-700 text-lg">
                "The truthful, trustworthy merchant will be with the Prophets, the truthful, and the martyrs." — Prophet Muhammad ﷺ (Tirmidhi)
              </p>
            </blockquote>
          </div>
        </motion.section>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-cream-200 p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ink-800 mb-3">Our Mission</h3>
            <p className="text-ink-600 leading-relaxed">
              To empower Muslim entrepreneurs and serve Muslim consumers by providing the world's most trusted, ethical, and comprehensive halal marketplace — rooted in Islamic values and compliant with UK law.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl border border-cream-200 p-8"
          >
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-gold-600" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-ink-800 mb-3">Our Vision</h3>
            <p className="text-ink-600 leading-relaxed">
              A world where every Muslim can access halal products and services with confidence, and every Muslim business owner has the tools to reach a global audience — all within a single, unified, Islamically-principled platform.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-ink-800 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-cream-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600 mb-4">
                  {v.icon}
                </div>
                <h3 className="font-bold text-ink-800 mb-2">{v.title}</h3>
                <p className="text-ink-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Charity Model */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gold-50 border border-gold-200 rounded-2xl p-8 md:p-12"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold-600 flex items-center justify-center shrink-0">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-800 mb-3">Built-in Sadaqah</h2>
              <p className="text-ink-600 leading-relaxed mb-4">
                Every transaction on Noor Marketplace automatically donates <strong>0.5% to verified Islamic charities</strong>. This is built into our 7% commission model — sellers pay nothing extra. Commerce becomes an act of worship.
              </p>
              <p className="text-ink-600 leading-relaxed">
                Charities supported include Islamic Relief, Muslim Aid, and other verified UK-registered Islamic charities. Donation totals are publicly tracked and reported quarterly.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Timeline */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-ink-800 mb-8 text-center">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gold-200 transform md:-translate-x-0.5" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year + i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative flex items-start gap-6 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="pl-10 md:pl-0 md:w-1/2 md:px-8">
                    <div className="bg-white rounded-xl border border-cream-200 p-5 shadow-sm">
                      <div className="text-gold-600 font-bold text-sm mb-1">{m.year}</div>
                      <p className="text-ink-600 text-sm leading-relaxed">{m.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-gold-500 rounded-full border-2 border-white shadow transform md:-translate-x-1.5 mt-5" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Legal */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-cream-200 p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-ink-100 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-ink-600" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-800 mb-3">Legal Information</h2>
              <div className="text-ink-600 text-sm space-y-1">
                <p><strong>Company Name:</strong> Noor Marketplace Ltd</p>
                <p><strong>Registered in:</strong> England & Wales</p>
                <p><strong>Registered Office:</strong> London, United Kingdom</p>
                <p><strong>Contact:</strong> hello@noormarketplace.com</p>
                <p><strong>Regulated by:</strong> UK Consumer Rights Act 2015, UK GDPR, FCA guidelines</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <div className="text-center py-8">
          <h2 className="font-serif text-3xl font-bold text-ink-800 mb-4">Join the Ummah Marketplace</h2>
          <p className="text-ink-500 mb-8 max-w-xl mx-auto">
            Whether you're a buyer looking for halal products or a seller ready to grow your business, Noor Marketplace is your home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="bg-gold-600 hover:bg-gold-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                Get Started Free
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-white hover:bg-cream-50 text-ink-800 font-semibold px-8 py-3 rounded-xl border border-cream-300 transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
