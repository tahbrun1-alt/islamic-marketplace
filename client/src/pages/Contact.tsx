import { useState } from "react";
import { Mail, MapPin, Clock, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production this would call the API
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-ink-900 text-white py-16">
        <div className="container text-center">
          <MessageSquare className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h1 className="font-serif text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-white/70 max-w-xl mx-auto">We're here to help. Reach out and we'll respond within 24 hours.</p>
        </div>
      </div>

      <div className="container py-16 max-w-5xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <h3 className="font-bold text-ink-800 mb-4">Get in Touch</h3>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-5 h-5" />, label: "Email", value: "hello@noormarketplace.com", href: "mailto:hello@noormarketplace.com" },
                  { icon: <MapPin className="w-5 h-5" />, label: "Location", value: "London, United Kingdom", href: null },
                  { icon: <Clock className="w-5 h-5" />, label: "Support Hours", value: "Mon–Fri, 9am–6pm GMT", href: null },
                ].map(item => (
                  <div key={item.label} className="flex gap-3">
                    <div className="text-gold-600 mt-0.5 shrink-0">{item.icon}</div>
                    <div>
                      <div className="text-xs text-ink-400 font-semibold uppercase tracking-wide">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-ink-700 hover:text-gold-600 transition-colors text-sm">{item.value}</a>
                      ) : (
                        <div className="text-ink-700 text-sm">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-cream-200 p-6">
              <h3 className="font-bold text-ink-800 mb-3">Specialist Teams</h3>
              <div className="space-y-3 text-sm">
                {[
                  { team: "General Support", email: "hello@noormarketplace.com" },
                  { team: "Seller Support", email: "sellers@noormarketplace.com" },
                  { team: "Privacy & Data", email: "privacy@noormarketplace.com" },
                  { team: "Trust & Safety", email: "trust@noormarketplace.com" },
                  { team: "Press & Media", email: "press@noormarketplace.com" },
                ].map(item => (
                  <div key={item.team}>
                    <div className="text-ink-500 text-xs">{item.team}</div>
                    <a href={`mailto:${item.email}`} className="text-gold-600 hover:underline">{item.email}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-cream-200 p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="font-serif text-2xl font-bold text-ink-800 mb-2">Message Sent!</h3>
                  <p className="text-ink-500">Thank you for reaching out. We'll get back to you within 24 hours, insha'Allah.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-6 text-gold-600 hover:underline text-sm">
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-2xl font-bold text-ink-800 mb-6">Send us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-ink-700 mb-1.5">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-cream-300 rounded-xl px-4 py-2.5 text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                          placeholder="Muhammad Ali"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-ink-700 mb-1.5">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-cream-300 rounded-xl px-4 py-2.5 text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink-700 mb-1.5">Subject *</label>
                      <select
                        required
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-cream-300 rounded-xl px-4 py-2.5 text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                      >
                        <option value="">Select a topic...</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return / Refund</option>
                        <option value="seller">Seller Account</option>
                        <option value="payment">Payment Problem</option>
                        <option value="account">Account / Login</option>
                        <option value="report">Report a Seller</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-ink-700 mb-1.5">Message *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        className="w-full border border-cream-300 rounded-xl px-4 py-2.5 text-ink-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                        placeholder="Please describe your issue in detail..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gold-600 text-white py-3 rounded-xl font-semibold hover:bg-gold-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                    <p className="text-xs text-ink-400 text-center">
                      By submitting this form, you agree to our <a href="/privacy" className="text-gold-600 hover:underline">Privacy Policy</a>. We typically respond within 24 hours.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
