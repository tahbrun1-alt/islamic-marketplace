import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
  no_show: "bg-gray-100 text-gray-700",
  refunded: "bg-purple-100 text-purple-700",
};

export default function Bookings() {
  const { isAuthenticated, loading } = useAuth();
  const { data: bookings, isLoading } = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated });
  const [payingId, setPayingId] = useState<number | null>(null);

  const payDepositMutation = trpc.payments.createBookingCheckout.useMutation({
    onSuccess: (data: { checkoutUrl: string | null }) => {
      if (data.checkoutUrl) {
        toast.success("Redirecting to secure payment...");
        window.location.href = data.checkoutUrl;
      } else {
        toast.error("Failed to create payment session");
        setPayingId(null);
      }
    },
    onError: (e: { message?: string }) => {
      toast.error(e.message || "Payment failed. Please try again.");
      setPayingId(null);
    },
  });

  const handlePayDeposit = (bookingId: number) => {
    setPayingId(bookingId);
    payDepositMutation.mutate({ bookingId, origin: window.location.origin });
  };

  if (loading || isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Calendar className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Sign in to view your bookings</h2>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-primary" /> My Bookings
        </h1>

        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-foreground">Booking #{booking.bookingNumber}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[booking.status] ?? "bg-gray-100 text-gray-700"}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.scheduledAt).toLocaleDateString()}</span>
                        <Clock className="w-4 h-4 ml-2" />
                        <span>{new Date(booking.scheduledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      {booking.notes && (
                        <p className="text-sm text-muted-foreground mt-2 border-t border-border pt-2">{booking.notes}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-primary">£{Number(booking.totalAmount).toFixed(2)}</p>
                      {Number(booking.depositAmount) > 0 && (
                        <p className="text-xs text-muted-foreground">Deposit: £{Number(booking.depositAmount).toFixed(2)}</p>
                      )}
                      {!booking.depositPaid && booking.status === "pending" && Number(booking.depositAmount) > 0 && (
                        <Button
                          size="sm"
                          className="mt-2 btn-gold text-xs"
                          onClick={() => handlePayDeposit(booking.id)}
                          disabled={payingId === booking.id}
                        >
                          <CreditCard className="w-3.5 h-3.5 mr-1" />
                          {payingId === booking.id ? "Processing..." : "Pay Deposit"}
                        </Button>
                      )}
                      {booking.depositPaid && (
                        <p className="text-xs text-emerald-600 font-medium mt-1">✓ Deposit paid</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-border">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2 text-foreground">No bookings yet</h3>
            <p className="text-muted-foreground mb-6">Browse services and book your first appointment</p>
            <Button asChild><Link href="/services">Browse Services</Link></Button>
          </div>
        )}
      </div>
    </div>
  );
}
