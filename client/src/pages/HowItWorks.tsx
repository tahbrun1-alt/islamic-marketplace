import React from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag, Store, CreditCard, Truck, Star, Shield,
  Calendar, CheckCircle, Users, Package, ArrowRight, Sparkles,
  Heart, Search, Globe, Lock, Zap, Building2, GraduationCap, Utensils } from "lucide-react";

const buyerSteps = [
  { icon: Search, step: "1", title: "Browse & Discover", desc: "Search thousands of halal products and Islamic services from verified Muslim sellers worldwide." },
  { icon: ShoppingBag, step: "2", title: "Add to Cart", desc: "Select your items, choose variations, and add them to your secure shopping cart." },
  { icon: CreditCard, step: "3", title: "Secure Checkout", desc: "Pay securely via Stripe. Your payment is protected and encrypted end-to-end." },
  { icon: Truck, step: "4", title: "Receive & Review", desc: "Get your order delivered and leave a review to help the Ummah make informed decisions." },
];

const sellerSteps = [
  { icon: Store, step: "1", title: "Create Your Shop", desc: "Sign up and create your shop profile in minutes. Free for 14 days, then just 7% total commission." },
  { icon: Package, step: "2", title: "List Products/Services", desc: "Add your halal products or Islamic services with photos, descriptions, and pricing — or import from any URL instantly." },
  { icon: Users, step: "3", title: "Reach the Ummah", desc: "Your listings are visible to Muslim customers across the globe. Grow your halal business with ease." },
  { icon: CreditCard, step: "4", title: "Get Paid", desc: "Receive payments directly to your account. We handle the platform, you keep 93% of every sale." },
];

const commissionDetails = [
  { label: "Trial Period", value: "14 days FREE", highlight: true },
  { label: "Total Commission", value: "7%", highlight: false },
  { label: "Platform Fee", value: "6.5%", highlight: false },
  { label: "Charity (Sadaqah)", value: "0.5%", highlight: false },
  { label: "Monthly Fee", value: "£0", highlight: false },
  { label: "Listing Fee", value: "£0", highlight: false },
];

const faqs = [
  {
    q: "Is Noor Marketplace halal certified?",
    a: "Yes. All sellers are vetted to ensure their products and services comply with Islamic principles. We have a dedicated halal compliance team that reviews listings and investigates complaints."
  },
  {
    q: "How does the 14-day free trial work?",
    a: "When you create a shop, you get 14 days completely free — no commission charged on any sales. After the trial, a 7% total commission applies (6.5% platform + 0.5% auto-donated to charity). There are no monthly fees or listing fees."
  },
  {
    q: "Where does the 0.5% charity donation go?",
    a: "Every transaction automatically donates 0.5% to verified Islamic charities. This is tracked transparently in your order receipts and in our admin dashboard. We partner with reputable organisations supporting education, food relief, and community development."
  },
  {
    q: "Can I sell both products and services?",
    a: "Absolutely! Noor Marketplace supports both physical products, digital downloads, and bookable services. You can manage everything from one seller dashboard."
  },
  {
    q: "How are payments processed?",
    a: "All payments are processed securely via Stripe. Buyers pay at checkout, and funds are transferred to sellers after order confirmation, minus the 7% total commission."
  },
  {
    q: "Can I import my existing products from another website?",
    a: "Yes! Our AI-powered product importer lets you paste any product URL and we'll automatically extract the title, description, price, and images. It's the fastest way to migrate your existing inventory to Noor Marketplace."
  },
  {
    q: "What happens if a buyer has a dispute?",
    a: "We have a dedicated dispute resolution team. Buyers should first contact the seller directly. If unresolved, they can raise a dispute through the platform and we'll mediate within 5 business days."
  },
  {
    q: "Can I offer services online and in-person?",
    a: "Yes! Service providers can offer online sessions, in-person appointments at their location, or travel to the client. You control your availability and booking settings."
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="hero-gradient py-16 text-white text-center">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Simple, transparent, halal
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              How Noor Marketplace Works
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto">
              Whether you're buying halal products or selling to the Ummah — we've made it simple, secure, and blessed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* For Buyers */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 mb-3">For Buyers</Badge>
            <h2 className="text-3xl font-bold text-foreground">Shop with Confidence</h2>
            <p className="text-muted-foreground mt-2">Everything halal, all in one place</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {buyerSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-sm text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                      <step.icon className="w-6 h-6 text-primary" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{step.step}</span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link href="/products"><ShoppingBag className="w-4 h-4 mr-2" /> Start Shopping</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* For Sellers */}
      <section className="py-16 pattern-bg">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="bg-emerald-100 text-emerald-700 mb-3">For Sellers</Badge>
            <h2 className="text-3xl font-bold text-foreground">Sell to the Global Ummah</h2>
            <p className="text-muted-foreground mt-2">Start earning halal income today</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sellerSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-sm text-center h-full bg-white">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4 relative">
                      <step.icon className="w-6 h-6 text-emerald-600" />
                      <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">{step.step}</span>
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/seller/dashboard"><Store className="w-4 h-4 mr-2" /> Open Your Shop</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Commission */}
      <section id="commission" className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="bg-amber-100 text-amber-700 mb-3">Transparent Pricing</Badge>
            <h2 className="text-3xl font-bold text-foreground mb-4">Simple, Fair Commission</h2>
            <p className="text-muted-foreground mb-8">No hidden fees. No monthly subscriptions. Just a fair 7% total commission after your free trial — and 0.5% of every sale goes straight to charity.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              {commissionDetails.map((item) => (
                <div key={item.label} className={`rounded-xl p-4 border ${item.highlight ? "bg-primary text-primary-foreground border-primary" : "bg-secondary border-border"}`}>
                  <p className={`text-2xl font-bold mb-1 ${item.highlight ? "text-white" : "text-primary"}`}>{item.value}</p>
                  <p className={`text-xs ${item.highlight ? "text-white/80" : "text-muted-foreground"}`}>{item.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
              <p className="font-bold text-emerald-800 mb-2">Example: You sell an abaya for £89.99</p>
              <div className="text-sm text-emerald-700 space-y-1">
                <p>Sale price: £89.99</p>
                <p>Platform fee (6.5%): £5.85</p>
                <p>Charity donation (0.5%): £0.45</p>
                <p className="font-bold text-lg text-emerald-800">You receive: £83.69 — and £0.45 goes to charity automatically.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charity / Sadaqah Section */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, oklch(0.18 0.025 40) 0%, oklch(0.25 0.03 50) 100%)" }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
                Built-in Sadaqah
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Every Purchase Gives Back
              </h2>
              <p className="text-white/75 text-lg mb-10 leading-relaxed">
                0.5% of every transaction on Noor Marketplace is automatically donated to verified Islamic charities.
                No action needed — it happens seamlessly at checkout.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                {[
                  { Icon: Building2, title: "Masjid Building", desc: "Supporting the construction of mosques in underserved communities." },
                  { Icon: GraduationCap, title: "Islamic Education", desc: "Funding Quran schools and Islamic learning centres worldwide." },
                  { Icon: Utensils, title: "Food Relief", desc: "Feeding families in need across Muslim-majority countries." },
                ].map((item) => (
                  <div key={item.title} className="bg-white/10 rounded-xl p-5 text-center">
                    <div className="text-3xl mb-3"><item.Icon className="w-5 h-5" /></div>
                    <h3 className="font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-white/65 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <p className="text-white/80 text-sm italic mb-2">
                  "The Prophet ﷺ said: 'Charity does not decrease wealth.'" — Sahih Muslim
                </p>
                <p className="text-white/60 text-xs">
                  All charity contributions are tracked transparently. Sellers and buyers can see the exact amount donated on every receipt.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <Badge className="bg-slate-100 text-slate-700 mb-3">Trust & Security</Badge>
            <h2 className="text-3xl font-bold text-foreground">Built for the Ummah, Secured for Everyone</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Halal Verified", desc: "Every seller is vetted. Every product reviewed for halal compliance." },
              { icon: Lock, title: "Secure Payments", desc: "All transactions processed via Stripe with bank-level encryption." },
              { icon: Globe, title: "Global Reach", desc: "Sell to Muslim customers in 180+ countries from one dashboard." },
              { icon: Zap, title: "Instant Setup", desc: "Your shop is live in minutes. Import products from any URL instantly." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-sm text-center h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 pattern-bg">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to join the Ummah marketplace?</h2>
          <p className="text-muted-foreground mb-8">Start shopping or selling today — it's free to get started.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products"><ShoppingBag className="w-4 h-4 mr-2" /> Browse Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/seller/dashboard"><Store className="w-4 h-4 mr-2" /> Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
