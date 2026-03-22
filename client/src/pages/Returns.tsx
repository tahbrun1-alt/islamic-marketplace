import { RefreshCw, Package, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export default function Returns() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-ink-900 text-white py-16">
        <div className="container text-center">
          <RefreshCw className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-3">Returns &amp; Refunds Policy</h1>
          <p className="text-white/70 max-w-xl mx-auto">Last updated: 22 March 2026 — Compliant with UK Consumer Rights Act 2015</p>
        </div>
      </div>

      <div className="container py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8 md:p-12 space-y-10">

          {/* Quick summary */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: <Clock className="w-6 h-6" />, title: "14-Day Returns", desc: "Return most items within 14 days of receipt, no questions asked." },
              { icon: <RefreshCw className="w-6 h-6" />, title: "Full Refunds", desc: "Receive a full refund to your original payment method within 14 days." },
              { icon: <Package className="w-6 h-6" />, title: "Free Returns", desc: "If an item is faulty or not as described, return postage is covered." },
            ].map(item => (
              <div key={item.title} className="bg-gold-50 border border-gold-200 rounded-xl p-5 text-center">
                <div className="text-gold-600 mx-auto mb-3 flex justify-center">{item.icon}</div>
                <div className="font-bold text-ink-800 mb-1">{item.title}</div>
                <div className="text-ink-500 text-sm">{item.desc}</div>
              </div>
            ))}
          </div>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">1. Your Statutory Rights</h2>
            <p className="text-ink-600 leading-relaxed">
              Under the <strong>UK Consumer Rights Act 2015</strong> and the <strong>Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013</strong>, you have the right to cancel most online purchases within <strong>14 calendar days</strong> of receiving your goods, without giving any reason. This is your statutory "cooling-off" right and applies to all purchases made on Noor Marketplace.
            </p>
            <p className="text-ink-600 leading-relaxed mt-3">
              Additionally, if goods are faulty, not as described, or not fit for purpose, you have the right to a repair, replacement, or refund under the Consumer Rights Act 2015.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">2. How to Return an Item</h2>
            <ol className="space-y-4">
              {[
                { step: "1", title: "Notify us within 14 days", desc: "Log in to your account, go to Orders, and click 'Request Return' on the relevant order. Alternatively, email hello@noormarketplace.com with your order number." },
                { step: "2", title: "Package the item securely", desc: "Repack the item in its original packaging where possible. Include a note with your order number and reason for return." },
                { step: "3", title: "Post the item back", desc: "Send the item to the seller's return address (provided in your return confirmation email). We recommend using a tracked service." },
                { step: "4", title: "Receive your refund", desc: "Once the seller confirms receipt, your refund will be processed within 14 days to your original payment method." },
              ].map(item => (
                <li key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gold-600 text-white flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">{item.step}</div>
                  <div>
                    <div className="font-semibold text-ink-800 mb-1">{item.title}</div>
                    <div className="text-ink-600 text-sm">{item.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">3. Eligible &amp; Non-Eligible Returns</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-ink-800">Eligible for Return</span>
                </div>
                <ul className="space-y-2 text-ink-600 text-sm">
                  {[
                    "Unused items in original condition and packaging",
                    "Faulty or damaged items",
                    "Items not as described on the listing",
                    "Wrong item received",
                    "Items not delivered within 30 days",
                  ].map(i => <li key={i} className="flex gap-2"><span className="text-green-600">✓</span>{i}</li>)}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-500" />
                  <span className="font-semibold text-ink-800">Non-Eligible</span>
                </div>
                <ul className="space-y-2 text-ink-600 text-sm">
                  {[
                    "Perishable goods (food, fresh produce)",
                    "Personalised or custom-made items",
                    "Digital downloads once accessed",
                    "Hygiene products once unsealed (e.g. underwear, earrings)",
                    "Items returned after 14 days without a fault",
                  ].map(i => <li key={i} className="flex gap-2"><span className="text-red-500">✗</span>{i}</li>)}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">4. Refund Timelines</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-cream-100">
                    <th className="text-left p-3 font-semibold text-ink-700 rounded-tl-lg">Scenario</th>
                    <th className="text-left p-3 font-semibold text-ink-700 rounded-tr-lg">Refund Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200">
                  {[
                    ["Standard return (within 14 days)", "Within 14 days of seller receiving item"],
                    ["Faulty/not as described", "Within 14 days of raising dispute"],
                    ["Item not received", "Within 14 days of delivery deadline passing"],
                    ["Cancelled before dispatch", "Within 14 days of cancellation confirmation"],
                  ].map(([scenario, timeline]) => (
                    <tr key={scenario} className="hover:bg-cream-50">
                      <td className="p-3 text-ink-600">{scenario}</td>
                      <td className="p-3 text-ink-600">{timeline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-ink-500 text-sm mt-3">Refunds are processed to your original payment method. Bank processing times may add 3–5 business days.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">5. Services &amp; Bookings</h2>
            <p className="text-ink-600 leading-relaxed">
              For service bookings, cancellations made more than 48 hours before the scheduled service are fully refunded. Cancellations within 48 hours may be subject to a cancellation fee at the seller's discretion, which will be clearly stated in the service listing. If a seller cancels or fails to deliver a booked service, you are entitled to a full refund.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-bold text-ink-800 mb-4">6. Seller Responsibilities</h2>
            <p className="text-ink-600 leading-relaxed">
              All sellers on Noor Marketplace are required to honour this returns policy as a condition of selling on our platform. Sellers who repeatedly fail to process returns or refunds will have their accounts suspended. Noor Marketplace acts as an intermediary and will intervene in disputes where sellers do not comply with this policy.
            </p>
          </section>

          <div className="bg-gold-50 border border-gold-200 rounded-xl p-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-ink-800 mb-1">Need help with a return?</p>
              <p className="text-ink-600 text-sm">Contact our support team at <a href="mailto:hello@noormarketplace.com" className="text-gold-600 hover:underline">hello@noormarketplace.com</a> or visit our <a href="/help" className="text-gold-600 hover:underline">Help Centre</a>. We aim to respond within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
