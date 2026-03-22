/**
 * Noor Marketplace - Stripe Payment Service
 *
 * Commission model:
 *   - 7% total on every transaction
 *   - 6.5% platform fee (Noor Marketplace revenue)
 *   - 0.5% auto-donated to Islamic charity (Sadaqah)
 *
 * Sellers receive: 93% of the sale price
 */

import Stripe from "stripe";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn("[Stripe] STRIPE_SECRET_KEY not set — payments disabled");
}

export const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2026-02-25.clover" })
  : null;

// Commission constants
export const PLATFORM_FEE_PERCENT = 6.5;  // Platform revenue
export const CHARITY_FEE_PERCENT = 0.5;   // Auto-donated to charity
export const TOTAL_FEE_PERCENT = 7.0;     // Total deducted from seller

/**
 * Calculate fee breakdown for a given order total (in pence/cents)
 */
export function calculateFees(totalPence: number) {
  const platformFee = Math.round(totalPence * (PLATFORM_FEE_PERCENT / 100));
  const charityFee = Math.round(totalPence * (CHARITY_FEE_PERCENT / 100));
  const totalFee = platformFee + charityFee;
  const sellerReceives = totalPence - totalFee;
  return { platformFee, charityFee, totalFee, sellerReceives };
}

/**
 * Create a Stripe Checkout Session for a product order
 */
export async function createOrderCheckoutSession(params: {
  userId: number;
  userEmail: string;
  userName: string;
  items: Array<{
    name: string;
    description?: string;
    price: number; // in pence
    quantity: number;
    imageUrl?: string;
  }>;
  orderNumber: string;
  origin: string;
  couponCode?: string;
}) {
  if (!stripe) throw new Error("Stripe not configured");

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = params.items.map(item => ({
    price_data: {
      currency: "gbp",
      product_data: {
        name: item.name,
        description: item.description,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  const totalAmount = params.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const { platformFee, charityFee, totalFee } = calculateFees(totalAmount);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    allow_promotion_codes: true,
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName,
      order_number: params.orderNumber,
      platform_fee_pence: platformFee.toString(),
      charity_fee_pence: charityFee.toString(),
      total_fee_pence: totalFee.toString(),
      type: "product_order",
    },
    success_url: `${params.origin}/orders?success=1&order=${params.orderNumber}`,
    cancel_url: `${params.origin}/cart?cancelled=1`,
  });

  return { sessionId: session.id, url: session.url! };
}

/**
 * Create a Stripe Checkout Session for a service booking deposit
 */
export async function createBookingCheckoutSession(params: {
  userId: number;
  userEmail: string;
  userName: string;
  serviceName: string;
  serviceDescription?: string;
  depositAmount: number; // in pence
  bookingId: number;
  origin: string;
}) {
  if (!stripe) throw new Error("Stripe not configured");

  const { platformFee, charityFee } = calculateFees(params.depositAmount);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "gbp",
          product_data: {
            name: `Booking Deposit: ${params.serviceName}`,
            description: params.serviceDescription ?? "Service booking deposit",
          },
          unit_amount: params.depositAmount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: params.userEmail,
    client_reference_id: params.userId.toString(),
    metadata: {
      user_id: params.userId.toString(),
      customer_email: params.userEmail,
      customer_name: params.userName,
      booking_id: params.bookingId.toString(),
      platform_fee_pence: platformFee.toString(),
      charity_fee_pence: charityFee.toString(),
      type: "booking_deposit",
    },
    success_url: `${params.origin}/bookings?success=1&booking=${params.bookingId}`,
    cancel_url: `${params.origin}/services?cancelled=1`,
  });

  return { sessionId: session.id, url: session.url! };
}

/**
 * Verify and construct a Stripe webhook event
 */
export function constructWebhookEvent(payload: Buffer, signature: string) {
  if (!stripe) throw new Error("Stripe not configured");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET not set");
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
