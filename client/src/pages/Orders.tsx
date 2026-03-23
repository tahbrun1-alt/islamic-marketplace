import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, ShoppingBag, ChevronDown, ChevronUp, Heart,
  Truck, CheckCircle, Clock, XCircle, RotateCcw, MapPin
} from "lucide-react";
import { Link } from "wouter";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const STATUS_ICONS: Record<string, React.ElementType> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  refunded: RotateCcw,
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

type OrderItem = { title: string; quantity: number; price: number; image?: string; productId?: number };
type OrderType = {
  id: number;
  orderNumber: string;
  createdAt: Date;
  total: string;
  status: string;
  shippingAddress?: string | null;
  platformFee?: string | null;
  charityFee?: string | null;
  items?: OrderItem[];
};

function OrderCard({ order }: { order: OrderType }) {
  const [expanded, setExpanded] = useState(false);
  const StatusIcon = STATUS_ICONS[order.status] ?? Clock;
  const charityAmount = order.charityFee ? Number(order.charityFee) : Number(order.total) * 0.005;
  const platformAmount = order.platformFee ? Number(order.platformFee) : Number(order.total) * 0.065;
  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                <StatusIcon className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-foreground">Order #{order.orderNumber}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge className={`text-xs ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  {charityAmount > 0 && (
                    <span className="flex items-center gap-1 text-xs text-rose-600 font-medium">
                      <Heart className="w-3 h-3 fill-rose-500" /> £{charityAmount.toFixed(2)} to charity
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-bold text-primary text-lg">£{Number(order.total).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? "s" : ""}</p>
              </div>
              {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </div>
          </div>

          {order.status !== "cancelled" && order.status !== "refunded" && currentStepIndex >= 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1">
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`h-1.5 flex-1 rounded-full transition-all ${i <= currentStepIndex ? "bg-primary" : "bg-border"}`} />
                    {i < STATUS_STEPS.length - 1 && <div className="w-1" />}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {STATUS_STEPS.map((step, i) => (
                  <span key={step} className={`text-xs capitalize ${i <= currentStepIndex ? "text-primary font-medium" : "text-muted-foreground"}`}>
                    {step}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="border-t border-border">
                {order.items && order.items.length > 0 && (
                  <div className="p-5 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Items</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                          {item.image ? <img src={item.image} alt={item.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-secondary"><Package className="w-5 h-5 text-muted-foreground" /></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          {item.productId ? (
                            <Link href={`/products/${item.productId}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1">{item.title}</Link>
                          ) : (
                            <p className="text-sm font-medium text-foreground line-clamp-1">{item.title}</p>
                          )}
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} × £{item.price.toFixed(2)}</p>
                        </div>
                        <p className="text-sm font-bold text-foreground shrink-0">£{(item.quantity * item.price).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="px-5 pb-4 border-t border-border pt-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Payment Breakdown</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium text-foreground">£{Number(order.total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Platform fee (6.5%)</span>
                      <span className="text-muted-foreground">£{platformAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-rose-600"><Heart className="w-3 h-3 fill-rose-500" /> Charity donation (0.5%)</span>
                      <span className="text-rose-600 font-medium">£{charityAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-border pt-2 mt-2">
                      <span className="text-foreground">Total paid</span>
                      <span className="text-primary">£{Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-2.5 bg-rose-50 rounded-lg border border-rose-100">
                    <p className="text-xs text-rose-700 flex items-center gap-1.5">
                      <Heart className="w-3 h-3 fill-rose-500 shrink-0" />
                      <span><strong>£{charityAmount.toFixed(2)}</strong> from this order was automatically donated to Islamic charities. JazakAllah Khayran!</span>
                    </p>
                  </div>
                </div>

                {order.shippingAddress && (
                  <div className="px-5 pb-4 border-t border-border pt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Shipping Address</p>
                    <div className="flex items-start gap-2 text-sm text-foreground">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="whitespace-pre-line">{order.shippingAddress}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default function Orders() {
  const { isAuthenticated, loading } = useAuth();
  const { data: orders, isLoading } = trpc.orders.myOrders.useQuery(undefined, { enabled: isAuthenticated });

  if (loading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pattern-bg">
        <div className="text-center bg-white rounded-2xl p-10 shadow-xl max-w-sm mx-4">
          <Package className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-foreground">Sign in to view your orders</h2>
          <p className="text-muted-foreground text-sm mb-6">Track your purchases and see your charity contributions.</p>
          <Button asChild><Link href="/login">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  const totalCharity = orders?.reduce((sum, o) => {
    const fee = (o as { charityFee?: string | null }).charityFee;
    return sum + (fee ? Number(fee) : Number(o.total) * 0.005);
  }, 0) ?? 0;

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container max-w-3xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" /> My Orders
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{orders?.length ?? 0} order{(orders?.length ?? 0) !== 1 ? "s" : ""} total</p>
          </div>
          {totalCharity > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-right">
              <p className="text-xs text-rose-600 font-medium">Your total charity impact</p>
              <p className="text-lg font-bold text-rose-700 flex items-center gap-1 justify-end">
                <Heart className="w-4 h-4 fill-rose-500" /> £{totalCharity.toFixed(2)}
              </p>
            </div>
          )}
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <OrderCard order={order as OrderType} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-border">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2 text-foreground">No orders yet</h3>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Button asChild><Link href="/products">Browse Products</Link></Button>
          </div>
        )}
      </div>
    </div>
  );
}
