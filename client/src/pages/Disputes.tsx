import { Scale, MessageSquare, Clock, CheckCircle, AlertTriangle, Shield } from "lucide-react";

export default function Disputes() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-ink-900 text-white py-16">
        <div className="container text-center">
          <Scale className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-3">Dispute Resolution</h1>
          <p className="text-white/70 max-w-xl mx-auto">Fair, transparent, and Islamically-principled resolution for all disputes</p>
        </div>
      </div>

      <div className="container py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8 md:p-12 space-y-10">

          <div className="bg-gold-50 border-l-4 border-gold-500 rounded-r-xl p-5">
            <p className="text-ink-700 italic font-serif text-lg">
              "O you who believe! Stand firmly for justice, as witnesses to Allah, even if it be against yourselves." — Quran 4:135
            </p>
          </div>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">Our Approach to Disputes</h2>
            <p className="text-ink-600 leading-relaxed">
              Noor Marketplace is committed to fair and transparent dispute resolution in accordance with UK consumer law and Islamic principles of justice (<em>adl</em>). We comply with the <strong>Alternative Dispute Resolution for Consumer Disputes (Competent Authorities and Information) Regulations 2015</strong> and the <strong>EU/UK ODR Platform requirements</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">Step-by-Step Dispute Process</h2>
            <div className="space-y-4">
              {[
                {
                  step: "Step 1",
                  title: "Contact the Seller Directly",
                  time: "Within 48 hours",
                  icon: <MessageSquare className="w-5 h-5" />,
                  desc: "First, message the seller directly through the platform's messaging system. Most issues are resolved at this stage. Sellers are required to respond within 48 hours.",
                  color: "bg-blue-50 border-blue-200",
                  iconColor: "text-blue-600",
                },
                {
                  step: "Step 2",
                  title: "Open a Formal Dispute",
                  time: "Within 30 days of issue",
                  icon: <Scale className="w-5 h-5" />,
                  desc: "If the seller does not resolve the issue, open a formal dispute via your Orders page. Click 'Open Dispute' and provide evidence (photos, messages, tracking info). Both parties will be notified.",
                  color: "bg-gold-50 border-gold-200",
                  iconColor: "text-gold-600",
                },
                {
                  step: "Step 3",
                  title: "Noor Mediation",
                  time: "3–5 business days",
                  icon: <Shield className="w-5 h-5" />,
                  desc: "Our trained mediation team reviews all evidence submitted by both parties. We will contact both buyer and seller and attempt to reach a fair resolution. Our decision is guided by UK consumer law and Islamic principles of fairness.",
                  color: "bg-purple-50 border-purple-200",
                  iconColor: "text-purple-600",
                },
                {
                  step: "Step 4",
                  title: "Final Decision",
                  time: "Within 10 business days",
                  icon: <CheckCircle className="w-5 h-5" />,
                  desc: "If mediation does not produce agreement, Noor Marketplace will issue a binding final decision. This may include a full refund, partial refund, or dismissal of the claim. All decisions are documented and communicated in writing.",
                  color: "bg-green-50 border-green-200",
                  iconColor: "text-green-600",
                },
              ].map(item => (
                <div key={item.step} className={`${item.color} border rounded-xl p-5 flex gap-4`}>
                  <div className={`${item.iconColor} mt-0.5 shrink-0`}>{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                      <div className="font-bold text-ink-800">{item.step}: {item.title}</div>
                      <div className="flex items-center gap-1 text-xs text-ink-500">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>
                    <p className="text-ink-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">What Evidence to Provide</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Photos or videos of the item received",
                "Screenshots of the original product listing",
                "Proof of payment (order confirmation email)",
                "Tracking information and delivery confirmation",
                "Screenshots of all communications with the seller",
                "Any other relevant documentation",
              ].map(item => (
                <div key={item} className="flex gap-2 text-ink-600 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">Outcomes &amp; Remedies</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-100">
                    <th className="text-left p-3 font-semibold text-ink-700 rounded-tl-lg">Dispute Type</th>
                    <th className="text-left p-3 font-semibold text-ink-700 rounded-tr-lg">Possible Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {[
                    ["Item not received", "Full refund issued"],
                    ["Item significantly not as described", "Full refund + return label provided"],
                    ["Item arrived damaged", "Full or partial refund depending on severity"],
                    ["Seller did not deliver service", "Full refund of deposit"],
                    ["Buyer changed mind (within 14 days)", "Refund minus return postage cost"],
                    ["Counterfeit or non-halal item", "Full refund + seller account review"],
                  ].map(([type, outcome]) => (
                    <tr key={type} className="hover:bg-cream-50">
                      <td className="p-3 text-ink-600">{type}</td>
                      <td className="p-3 text-ink-600">{outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">External Dispute Resolution</h2>
            <p className="text-ink-600 leading-relaxed">
              If you are not satisfied with our internal dispute resolution outcome, you have the right to seek external resolution through:
            </p>
            <ul className="mt-3 space-y-2 text-ink-600">
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Citizens Advice</strong> — Free consumer advice at <a href="https://www.citizensadvice.org.uk" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">citizensadvice.org.uk</a></span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Trading Standards</strong> — Report unfair trading practices via Citizens Advice consumer helpline: 0808 223 1133</span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Online Dispute Resolution (ODR)</strong> — EU/UK ODR platform at <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">ec.europa.eu/consumers/odr</a></span></li>
              <li className="flex gap-2"><span className="text-gold-600 font-bold">•</span><span><strong>Small Claims Court</strong> — For claims up to £10,000 in England and Wales.</span></li>
            </ul>
          </section>

          <div className="bg-cream-100 rounded-xl p-6 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ink-800 mb-1">Seller Misconduct</p>
              <p className="text-ink-600 text-sm">If a seller is found to have sold counterfeit goods, non-halal items falsely described as halal, or engaged in fraudulent behaviour, their account will be permanently suspended and the matter referred to relevant authorities.</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-ink-600 mb-4">Ready to open a dispute?</p>
            <a href="/orders" className="inline-block bg-gold-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gold-700 transition-colors">
              Go to My Orders
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
