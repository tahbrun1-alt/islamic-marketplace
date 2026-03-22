import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ShieldCheck, Lock, CreditCard, Truck, Tag, CheckCircle2, X } from "lucide-react";

export default function Checkout() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const total = getTotal();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [coupon, setCoupon] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("fixed");
  const [couponApplied, setCouponApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const validateCouponMutation = trpc.coupons.validate.useMutation({
    onSuccess: (data) => {
      setCoupon(couponInput);
      setCouponApplied(true);
      const type = data.coupon.type as "percentage" | "fixed";
      const value = Number(data.coupon.value);
      setDiscountType(type);
      setDiscount(value);
      toast.success(`Coupon applied! You save ${type === "percentage" ? value + "%" : "£" + value.toFixed(2)}`);
    },
    onError: (e) => toast.error(e.message || "Invalid coupon code"),
  });

  const discountAmount = couponApplied
    ? discountType === "percentage"
      ? (total * discount) / 100
      : Math.min(discount, total)
    : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  const createOrderMutation = trpc.payments.createOrderIntent.useMutation({
    onSuccess: (data) => {
      clearCart();
      toast.success("Order placed! Redirecting to payment...");
      // In production, redirect to Stripe checkout
      navigate("/orders");
    },
    onError: (e) => {
      toast.error(e.message);
      setIsProcessing(false);
    },
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Sign in to checkout</h2>
          <p className="text-muted-foreground mb-6">Create an account or sign in to complete your purchase</p>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Your cart is empty</h2>
          <Button asChild><a href="/products">Browse Products</a></Button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    createOrderMutation.mutate({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, variation: i.variation })),
      couponCode: coupon || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container max-w-4xl">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" /> Secure Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-6">
            {/* Shipping Details */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="w-4 h-4 text-primary" /> Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Full Name *</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Address *</Label>
                    <Input value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <Label>City *</Label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1" />
                    </div>
                    <div>
                      <Label>Postcode *</Label>
                      <Input value={postcode} onChange={(e) => setPostcode(e.target.value)} required className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-secondary/50 rounded-xl p-4 text-center">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">Secure Payment via Stripe</p>
                    <p className="text-xs text-muted-foreground mt-1">Your payment details are encrypted and never stored</p>
                  </div>
                  <div className="mt-4">
                    <Label className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Coupon Code</Label>
                    {couponApplied ? (
                      <div className="flex items-center gap-2 mt-1 p-3 bg-primary/10 rounded-lg border border-primary/30">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm font-medium text-primary flex-1">{coupon} applied!</span>
                        <button type="button" onClick={() => { setCouponApplied(false); setCoupon(""); setCouponInput(""); setDiscount(0); }} className="text-muted-foreground hover:text-foreground">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-1">
                        <Input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="NOOR10"
                          className="uppercase"
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), couponInput.trim() && validateCouponMutation.mutate({ code: couponInput.trim(), amount: total }))}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => couponInput.trim() && validateCouponMutation.mutate({ code: couponInput.trim(), amount: total })}
                          disabled={!couponInput.trim() || validateCouponMutation.isPending}
                        >
                          {validateCouponMutation.isPending ? "..." : "Apply"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-sm sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-foreground line-clamp-2">{item.title}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold text-primary">£{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">£{total.toFixed(2)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-primary">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Discount ({coupon})
                        </span>
                        <span>-£{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-muted-foreground">Calculated at delivery</span>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold text-lg mb-4">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">£{finalTotal.toFixed(2)}</span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-gold"
                    size="lg"
                    disabled={isProcessing || !name || !email || !address}
                  >
                    {isProcessing ? "Processing..." : `Pay £${finalTotal.toFixed(2)}`}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    SSL encrypted • Halal verified sellers
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
