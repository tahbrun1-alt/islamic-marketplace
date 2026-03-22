import { Link } from "wouter";
import { Shield, Lock, Eye, Database, Globe, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="bg-ink-900 text-white py-16">
        <div className="container text-center">
          <Shield className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-white/70 max-w-xl mx-auto">Last updated: 22 March 2026</p>
        </div>
      </div>

      <div className="container py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8 md:p-12 space-y-10">

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">1. Who We Are</h2>
            <p className="text-ink-600 leading-relaxed">
              Noor Marketplace Ltd ("Noor", "we", "us", "our") is a company registered in England and Wales. We operate the Noor Marketplace platform at noormarketplace.com — an Islamic e-commerce marketplace connecting halal sellers and buyers worldwide.
            </p>
            <p className="text-ink-600 leading-relaxed mt-3">
              <strong>Data Controller:</strong> Noor Marketplace Ltd, London, United Kingdom.<br />
              <strong>Contact:</strong> <a href="mailto:privacy@noormarketplace.com" className="text-gold-600 hover:underline">privacy@noormarketplace.com</a>
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">2. What Data We Collect</h2>
            <p className="text-ink-600 leading-relaxed mb-3">We collect the following categories of personal data:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: <Database className="w-5 h-5" />, title: "Account Data", desc: "Name, email address, password (hashed), profile photo, bio, and location." },
                { icon: <Globe className="w-5 h-5" />, title: "Transaction Data", desc: "Order history, payment records, delivery addresses, and dispute correspondence." },
                { icon: <Eye className="w-5 h-5" />, title: "Usage Data", desc: "Pages visited, search queries, clicks, device type, browser, and IP address." },
                { icon: <Lock className="w-5 h-5" />, title: "Communications", desc: "Messages sent via our platform, support tickets, and review content." },
              ].map(item => (
                <div key={item.title} className="bg-cream-50 rounded-xl p-4 flex gap-3">
                  <div className="text-gold-600 mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <div className="font-semibold text-ink-800 text-sm mb-1">{item.title}</div>
                    <div className="text-ink-500 text-sm">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">3. Legal Basis for Processing</h2>
            <p className="text-ink-600 leading-relaxed mb-3">Under UK GDPR, we process your data on the following legal bases:</p>
            <ul className="space-y-2 text-ink-600">
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Contract performance</strong> — to provide our marketplace services, process orders, and manage your account.</span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Legitimate interests</strong> — to improve our platform, prevent fraud, and ensure security.</span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Legal obligation</strong> — to comply with UK tax law, anti-money laundering regulations, and court orders.</span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Consent</strong> — for marketing communications (you may withdraw consent at any time).</span></li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">4. How We Use Your Data</h2>
            <ul className="space-y-2 text-ink-600">
              {[
                "To create and manage your account",
                "To process orders, payments, and refunds",
                "To connect buyers with sellers and facilitate transactions",
                "To send transactional emails (order confirmations, shipping updates)",
                "To send marketing communications (with your consent)",
                "To detect and prevent fraud, abuse, and illegal activity",
                "To comply with legal obligations under UK law",
                "To improve our platform through analytics",
                "To calculate and donate the 0.5% charity contribution from each transaction",
              ].map(item => (
                <li key={item} className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span>{item}</span></li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">5. Data Sharing</h2>
            <p className="text-ink-600 leading-relaxed mb-3">We do not sell your personal data. We share data only with:</p>
            <ul className="space-y-2 text-ink-600">
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Sellers</strong> — your name and delivery address when you place an order with them.</span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Stripe</strong> — our payment processor. Stripe processes payment data under their own privacy policy and is PCI-DSS compliant.</span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Hosting providers</strong> — Railway (server infrastructure) and Cloudflare (CDN/DDoS protection).</span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Legal authorities</strong> — where required by law, court order, or to protect rights and safety.</span></li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">6. Data Retention</h2>
            <p className="text-ink-600 leading-relaxed">
              We retain your account data for as long as your account is active. Transaction records are retained for 7 years to comply with UK tax and accounting obligations (HMRC requirements). You may request deletion of your account and personal data at any time, subject to legal retention requirements.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">7. Your Rights Under UK GDPR</h2>
            <p className="text-ink-600 leading-relaxed mb-3">You have the following rights:</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { right: "Right of Access", desc: "Request a copy of all data we hold about you." },
                { right: "Right to Rectification", desc: "Correct inaccurate or incomplete data." },
                { right: "Right to Erasure", desc: "Request deletion of your data ('right to be forgotten')." },
                { right: "Right to Restriction", desc: "Limit how we process your data in certain circumstances." },
                { right: "Right to Portability", desc: "Receive your data in a machine-readable format." },
                { right: "Right to Object", desc: "Object to processing based on legitimate interests or for marketing." },
              ].map(item => (
                <div key={item.right} className="bg-cream-50 rounded-xl p-4">
                  <div className="font-semibold text-ink-800 text-sm mb-1">{item.right}</div>
                  <div className="text-ink-500 text-sm">{item.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-ink-600 mt-4">
              To exercise any of these rights, email us at <a href="mailto:privacy@noormarketplace.com" className="text-gold-600 hover:underline">privacy@noormarketplace.com</a>. We will respond within 30 days. You also have the right to lodge a complaint with the <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">Information Commissioner's Office (ICO)</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">8. Cookies</h2>
            <p className="text-ink-600 leading-relaxed">
              We use essential cookies for authentication (keeping you logged in) and session management. We do not use third-party advertising cookies. Analytics cookies are used only in aggregate, anonymised form. You can disable cookies in your browser settings, but this may affect platform functionality.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">9. Security</h2>
            <p className="text-ink-600 leading-relaxed">
              We implement industry-standard security measures including TLS/SSL encryption for all data in transit, bcrypt password hashing, and regular security audits. Payments are processed entirely by Stripe — we never store card numbers on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">10. Changes to This Policy</h2>
            <p className="text-ink-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by email or a prominent notice on our platform. Continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <div className="bg-gold-50 border border-gold-200 rounded-xl p-6 text-center">
            <Mail className="w-8 h-8 text-gold-600 mx-auto mb-3" />
            <p className="text-ink-700 font-semibold mb-1">Questions about your privacy?</p>
            <p className="text-ink-500 text-sm mb-3">Our Data Protection team is here to help.</p>
            <a href="mailto:privacy@noormarketplace.com" className="inline-block bg-gold-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gold-700 transition-colors text-sm">
              Contact Privacy Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
