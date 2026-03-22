import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, AlertTriangle, Star, BookOpen, Award, Search } from "lucide-react";
import { Link } from "wouter";

const halalCategories = [
  {
    icon: "🍖",
    title: "Food & Beverages",
    allowed: [
      "Halal-certified meat and poultry (with valid certification)",
      "Zabiha (hand-slaughtered) meat",
      "Seafood (fish, prawns, etc.)",
      "Fruits, vegetables, grains",
      "Dairy products (without animal rennet from non-halal sources)",
      "Confectionery free from gelatin or alcohol",
    ],
    prohibited: [
      "Pork and pork derivatives (gelatin, lard, etc.)",
      "Alcohol and alcoholic beverages",
      "Non-halal slaughtered meat",
      "Blood and blood products",
      "Carnivorous animals and birds of prey",
    ],
  },
  {
    icon: "💄",
    title: "Beauty & Personal Care",
    allowed: [
      "Plant-based and mineral cosmetics",
      "Alcohol-free perfumes and attars",
      "Halal-certified skincare products",
      "Natural and organic beauty products",
      "Wudu-friendly nail polishes",
    ],
    prohibited: [
      "Products containing porcine-derived ingredients",
      "Alcohol-based perfumes (ethanol)",
      "Products tested on animals (where Islamic ethics apply)",
      "Cosmetics with haram additives (carmine from insects, etc.)",
    ],
  },
  {
    icon: "💰",
    title: "Financial Products & Services",
    allowed: [
      "Halal investment products (Shariah-compliant)",
      "Islamic finance consultancy",
      "Takaful (Islamic insurance) services",
      "Zakat calculation and management services",
      "Sadaqah and waqf facilitation",
    ],
    prohibited: [
      "Interest-bearing (riba) products",
      "Conventional insurance products",
      "Speculative investments (maysir/gambling)",
      "Short-selling and derivatives",
      "Investments in haram industries",
    ],
  },
  {
    icon: "🎓",
    title: "Education & Services",
    allowed: [
      "Quran tutoring and Islamic education",
      "Arabic language lessons",
      "Halal business consultancy",
      "Islamic counselling and therapy",
      "Nikah (marriage) services",
      "Hijama (cupping) therapy by qualified practitioners",
    ],
    prohibited: [
      "Services promoting haram activities",
      "Mixed-gender services without Islamic boundaries",
      "Astrology, fortune-telling, or magic",
      "Services involving deception or exploitation",
    ],
  },
];

const certificationBodies = [
  { name: "Halal Food Authority (HFA)", country: "UK", website: "https://www.halalfoodauthority.com" },
  { name: "Islamic Food and Nutrition Council of America (IFANCA)", country: "USA", website: "https://www.ifanca.org" },
  { name: "Jabatan Kemajuan Islam Malaysia (JAKIM)", country: "Malaysia", website: "https://www.halal.gov.my" },
  { name: "Emirates Authority for Standardization (ESMA)", country: "UAE", website: "https://www.esma.gov.ae" },
  { name: "Muslim World League", country: "International", website: "https://www.themwl.org" },
  { name: "Halal Certification Europe (HCE)", country: "Europe", website: "https://www.halalcertificationeurope.com" },
];

const verificationProcess = [
  {
    step: "1",
    title: "Seller Declaration",
    desc: "All sellers must declare the halal status of their products during listing. They must confirm compliance with our Halal Standards Policy.",
  },
  {
    step: "2",
    title: "Certification Upload",
    desc: "For food, cosmetics, and other applicable categories, sellers must upload valid halal certification from a recognised body.",
  },
  {
    step: "3",
    title: "Platform Review",
    desc: "Our compliance team reviews all certifications for validity, expiry dates, and authenticity before granting the Halal Verified badge.",
  },
  {
    step: "4",
    title: "Ongoing Monitoring",
    desc: "We conduct regular audits and require sellers to renew certifications before expiry. Community reports are investigated promptly.",
  },
  {
    step: "5",
    title: "Enforcement",
    desc: "Any seller found to have misrepresented halal status faces immediate suspension, product removal, and potential legal action.",
  },
];

export default function HalalStandards() {
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
              <span className="text-white text-2xl">🌙</span>
            </div>
            <h1 className="font-serif text-5xl font-bold mb-4">Halal Standards</h1>
            <p className="text-white/80 text-lg leading-relaxed">
              Our comprehensive framework for ensuring every product and service on Noor Marketplace meets the highest Islamic standards.
            </p>
            <p className="text-gold-400 font-arabic text-xl mt-4">الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ</p>
            <p className="text-white/60 text-sm mt-1">"The halal is clear and the haram is clear." — Prophet Muhammad ﷺ</p>
          </motion.div>
        </div>
      </div>

      <div className="container py-16 max-w-5xl space-y-12">

        {/* Introduction */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8 md:p-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-800 mb-2">Our Commitment to Halal</h2>
              <p className="text-ink-600 leading-relaxed">
                Noor Marketplace is built on the foundation of Islamic principles. We take our responsibility to the Muslim community seriously — every listing on our platform must comply with Shariah law. Our Halal Standards are developed in consultation with Islamic scholars and aligned with internationally recognised halal certification bodies.
              </p>
            </div>
          </div>
          <div className="bg-gold-50 border-l-4 border-gold-500 rounded-r-xl p-5">
            <p className="text-ink-700 italic font-serif">
              "O mankind, eat from whatever is on earth that is lawful and good and do not follow the footsteps of Satan. Indeed, he is to you a clear enemy." — Quran 2:168
            </p>
          </div>
        </motion.section>

        {/* Halal Badge */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gold-50 border border-gold-200 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-gold-600" />
            <h2 className="font-serif text-2xl font-bold text-ink-800">The Halal Verified Badge</h2>
          </div>
          <p className="text-ink-600 leading-relaxed mb-4">
            The <strong>🌙 Halal Verified</strong> badge on a listing means the seller has provided valid halal certification from a recognised certification body, and our compliance team has verified its authenticity and current validity.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: "Valid certification from recognised body" },
              { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: "Verified by Noor compliance team" },
              { icon: <CheckCircle className="w-5 h-5 text-green-600" />, text: "Renewed before expiry" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gold-100">
                {item.icon}
                <span className="text-ink-700 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Category Standards */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-ink-800 mb-8 text-center">Standards by Category</h2>
          <div className="space-y-6">
            {halalCategories.map((cat) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl border border-cream-200 p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{cat.icon}</span>
                  <h3 className="font-serif text-xl font-bold text-ink-800">{cat.title}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-700">Permitted (Halal)</span>
                    </div>
                    <ul className="space-y-2">
                      {cat.allowed.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
                          <span className="text-green-500 mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="font-semibold text-red-600">Prohibited (Haram)</span>
                    </div>
                    <ul className="space-y-2">
                      {cat.prohibited.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
                          <span className="text-red-400 mt-0.5">✗</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Verification Process */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-ink-800 mb-8 text-center">Our Verification Process</h2>
          <div className="space-y-4">
            {verificationProcess.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white rounded-xl border border-cream-200 p-6 flex items-start gap-5"
              >
                <div className="w-10 h-10 rounded-full bg-gold-600 text-white font-bold flex items-center justify-center shrink-0 text-lg">
                  {step.step}
                </div>
                <div>
                  <h3 className="font-bold text-ink-800 mb-1">{step.title}</h3>
                  <p className="text-ink-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recognised Certification Bodies */}
        <section>
          <h2 className="font-serif text-3xl font-bold text-ink-800 mb-4 text-center">Recognised Certification Bodies</h2>
          <p className="text-ink-500 text-center mb-8">
            We accept halal certifications from the following internationally recognised bodies. This list is regularly reviewed and updated.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {certificationBodies.map((body) => (
              <motion.div
                key={body.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-xl border border-cream-200 p-5 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-ink-800 text-sm">{body.name}</div>
                  <div className="text-ink-400 text-xs mt-0.5">{body.country}</div>
                </div>
                <a
                  href={body.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 hover:text-gold-700 text-xs font-medium"
                >
                  Visit →
                </a>
              </motion.div>
            ))}
          </div>
          <p className="text-ink-400 text-sm text-center mt-4">
            Using a certification body not listed here? <Link href="/contact" className="text-gold-600 hover:underline">Contact us</Link> for review.
          </p>
        </section>

        {/* Reporting Violations */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-8"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-8 h-8 text-red-500 shrink-0 mt-1" />
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-800 mb-3">Report a Violation</h2>
              <p className="text-ink-600 leading-relaxed mb-4">
                If you believe a listing is misrepresenting its halal status or violating our standards, please report it immediately. We take all reports seriously and investigate within 48 hours. False or misleading halal claims are a serious matter under both Islamic ethics and UK consumer protection law.
              </p>
              <Link href="/contact">
                <button className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm">
                  Report a Listing
                </button>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Scholarly Basis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-cream-200 p-8 md:p-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center shrink-0">
              <Search className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink-800 mb-2">Scholarly Basis</h2>
              <p className="text-ink-600 leading-relaxed">
                Our Halal Standards are developed in accordance with the Quran, Sunnah, and the consensus of contemporary Islamic scholars. We follow the guidelines of the <strong>Islamic Fiqh Academy</strong> and consult with qualified scholars (ulama) on complex or emerging issues. Our standards are reviewed annually to ensure they remain current and comprehensive.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {[
              { ref: "Quran 2:168", text: "Eat of what is lawful and good on earth." },
              { ref: "Quran 5:3", text: "Prohibited to you are dead animals, blood, the flesh of swine..." },
              { ref: "Hadith (Bukhari)", text: "What is halal is clear and what is haram is clear." },
              { ref: "Fiqh Principle", text: "The default ruling for all things is permissibility unless evidence indicates otherwise." },
            ].map((item) => (
              <div key={item.ref} className="bg-cream-50 rounded-xl p-4">
                <div className="text-gold-600 font-semibold text-xs mb-1">{item.ref}</div>
                <div className="text-ink-600 text-sm italic">"{item.text}"</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <div className="text-center py-4">
          <p className="text-ink-500 mb-6">
            Questions about our halal standards? Our compliance team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-gold-600 hover:bg-gold-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                Contact Compliance Team
              </button>
            </Link>
            <Link href="/seller/dashboard">
              <button className="bg-white hover:bg-cream-50 text-ink-800 font-semibold px-8 py-3 rounded-xl border border-cream-300 transition-colors">
                Start Selling
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
