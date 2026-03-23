/**
 * Stripe Webhook Handler for Noor Marketplace
 * Registered BEFORE express.json() to allow raw body access for signature verification
 */
import type { Express, Request, Response } from "express";
import express from "express";
import { constructWebhookEvent } from "./stripe";
import { getDb } from "./db";
import { orders, bookings } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const signature = req.headers["stripe-signature"] as string;

      let event: ReturnType<typeof constructWebhookEvent>;
      try {
        event = constructWebhookEvent(req.body as Buffer, signature);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("[Stripe Webhook] Signature verification failed:", msg);
        return res.status(400).json({ error: `Webhook Error: ${msg}` });
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Event: ${event.type} | ID: ${event.id}`);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as {
              id: string;
              metadata: Record<string, string>;
              payment_intent: string;
              amount_total: number;
            };
            const meta = session.metadata ?? {};
            const db = await getDb();
            if (!db) break;

            if (meta.type === "product_order" && meta.order_number) {
              // Mark order as paid
              await db
                .update(orders)
                .set({
                  status: "processing",
                  stripePaymentIntentId: session.payment_intent,
                  paidAt: new Date(),
                  platformFee: meta.platform_fee_pence ? (parseInt(meta.platform_fee_pence) / 100).toFixed(2) : null,
                  charityFee: meta.charity_fee_pence ? (parseInt(meta.charity_fee_pence) / 100).toFixed(2) : null,
                })
                .where(eq(orders.orderNumber, meta.order_number));
              console.log(`[Stripe Webhook] Order ${meta.order_number} marked as paid`);
            }

            if (meta.type === "booking_deposit" && meta.booking_id) {
              // Mark booking deposit as paid
              await db
                .update(bookings)
                .set({
                  depositPaid: true,
                  stripePaymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
                  status: "confirmed",
                })
                .where(eq(bookings.id, parseInt(meta.booking_id)));
              console.log(`[Stripe Webhook] Booking ${meta.booking_id} deposit confirmed`);
            }
            break;
          }

          case "payment_intent.payment_failed": {
            const pi = event.data.object as { id: string; metadata: Record<string, string> };
            console.warn(`[Stripe Webhook] Payment failed for PI: ${pi.id}`);
            // Mark any matching order as cancelled
            const db2 = await getDb();
            if (db2) {
              await db2.update(orders)
                .set({ status: "cancelled" })
                .where(eq(orders.stripePaymentIntentId, pi.id));
            }
            break;
          }

          case "payment_intent.succeeded": {
            // Fallback: if checkout.session.completed was missed, confirm via PI
            const pi = event.data.object as { id: string };
            const db3 = await getDb();
            if (!db3) break;
            // Find order by PI id and mark paid if still pending
            const [pendingOrder] = await db3
              .select()
              .from(orders)
              .where(and(eq(orders.stripePaymentIntentId, pi.id), eq(orders.status, "pending")))
              .limit(1);
            if (pendingOrder) {
              await db3.update(orders)
                .set({ status: "processing", paidAt: new Date() })
                .where(eq(orders.id, pendingOrder.id));
              console.log(`[Stripe Webhook] Order ${pendingOrder.orderNumber} confirmed via payment_intent.succeeded`);
            }
            // Find booking by PI id and confirm deposit if still pending
            const [pendingBooking] = await db3
              .select()
              .from(bookings)
              .where(and(eq(bookings.stripePaymentIntentId, pi.id), eq(bookings.status, "pending")))
              .limit(1);
            if (pendingBooking) {
              await db3.update(bookings)
                .set({ status: "confirmed", depositPaid: true })
                .where(eq(bookings.id, pendingBooking.id));
              console.log(`[Stripe Webhook] Booking ${pendingBooking.id} confirmed via payment_intent.succeeded`);
            }
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Error processing event:", err);
        // Return 200 to prevent Stripe retries for processing errors
      }

      return res.json({ received: true });
    }
  );
}
