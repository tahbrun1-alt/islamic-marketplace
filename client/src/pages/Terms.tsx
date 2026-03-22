import { motion } from "framer-motion";
import { Shield, FileText, Scale } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Terms & Conditions</h1>
              <p className="text-muted-foreground text-sm">Last updated: March 2025</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <p className="text-amber-800 text-sm font-medium">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ — In the name of Allah, the Most Gracious, the Most Merciful.
            </p>
            <p className="text-amber-700 text-sm mt-1">
              Noor Marketplace is committed to providing a halal, ethical, and transparent platform for the Muslim community. These terms reflect our Islamic values and commitment to fair dealing.
            </p>
          </div>

          <div className="prose prose-slate max-w-none space-y-8">
            {[
              {
                title: "1. Acceptance of Terms",
                content: `By accessing or using Noor Marketplace ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Platform. These terms apply to all users, including buyers, sellers, and service providers.`
              },
              {
                title: "2. Islamic Principles & Halal Standards",
                content: `Noor Marketplace operates on Islamic principles. All products and services listed must comply with Islamic law (Shariah). This means:

• No haram (forbidden) products including alcohol, pork, gambling-related items, or anything prohibited in Islam
• No riba (interest-based) financial products
• No deceptive or misleading listings (gharar)
• All products must be genuine and accurately described
• Services must be halal and ethical

Sellers who violate Islamic principles will have their accounts suspended immediately.`
              },
              {
                title: "3. Seller Terms & Commission",
                content: `Sellers on Noor Marketplace agree to the following:

Commission Structure:
• 14-day free trial for all new sellers — no commission charged during this period
• After the trial period: 6.5% commission on all sales (products and services)
• Commission is automatically deducted from each transaction
• No monthly subscription fees or listing fees

Seller Responsibilities:
• Provide accurate product descriptions, images, and pricing
• Ship orders within the stated processing time
• Respond to customer enquiries within 48 hours
• Maintain a minimum seller rating of 3.5 stars
• Comply with all applicable UK consumer protection laws
• Ensure all products are halal and Shariah-compliant`
              },
              {
                title: "4. Buyer Protection",
                content: `Noor Marketplace offers buyer protection for all purchases:

• 14-day return policy for physical products (unless stated otherwise by seller)
• Full refund if item is not as described
• Dispute resolution service available for all transactions
• Secure payment processing via Stripe
• Personal data protected under GDPR

Digital products are non-refundable once downloaded, unless the file is defective.`
              },
              {
                title: "5. Service Bookings",
                content: `For service bookings:

• Deposits may be required by service providers (typically 20-50% of service fee)
• Cancellation policy varies by provider — check individual listings
• Standard cancellation: Full refund if cancelled 48+ hours before appointment
• Late cancellation (under 24 hours): Deposit may be forfeited
• No-show: Full payment may be charged
• Providers must honour confirmed bookings or provide alternative arrangements`
              },
              {
                title: "6. Prohibited Content",
                content: `The following are strictly prohibited on Noor Marketplace:

• Haram products (alcohol, pork, tobacco, gambling, adult content)
• Counterfeit or replica goods
• Stolen property
• Items that infringe intellectual property rights
• Misleading or false advertising
• Hate speech or content that promotes discrimination
• Any content that violates Islamic principles or UK law`
              },
              {
                title: "7. Privacy & Data Protection",
                content: `We take your privacy seriously. We collect and process personal data in accordance with GDPR and our Privacy Policy. Your data is:

• Never sold to third parties
• Used only to facilitate transactions and improve the platform
• Stored securely with industry-standard encryption
• Accessible to you at any time for review or deletion

For full details, please see our Privacy Policy.`
              },
              {
                title: "8. Dispute Resolution",
                content: `In case of disputes:

1. Contact the seller/provider directly first
2. If unresolved within 48 hours, raise a dispute through the Platform
3. Our team will review and mediate within 5 business days
4. Decisions are based on Islamic principles of fairness (adl) and evidence
5. For legal disputes, English law applies and courts of England and Wales have jurisdiction`
              },
              {
                title: "9. Intellectual Property",
                content: `All content on Noor Marketplace, including the logo, design, and software, is owned by Noor Marketplace Ltd. Sellers retain ownership of their product images and descriptions but grant Noor Marketplace a licence to display them on the Platform.`
              },
              {
                title: "10. Limitation of Liability",
                content: `Noor Marketplace acts as a marketplace facilitator and is not responsible for:

• The quality or accuracy of seller listings
• Disputes between buyers and sellers (though we will assist in resolution)
• Delays caused by third-party shipping providers
• Technical issues outside our control

Our liability is limited to the value of the transaction in question.`
              },
              {
                title: "11. Changes to Terms",
                content: `We reserve the right to update these Terms at any time. Users will be notified of significant changes via email. Continued use of the Platform after changes constitutes acceptance of the new terms.`
              },
              {
                title: "12. Contact",
                content: `For questions about these Terms, contact us at:

Email: legal@noormarketplace.com
Address: Noor Marketplace Ltd, London, United Kingdom

May Allah bless all transactions on this platform and make them a source of barakah for the Ummah.`
              },
            ].map((section) => (
              <div key={section.title} className="bg-white rounded-xl p-6 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-3">{section.title}</h2>
                <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{section.content}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
