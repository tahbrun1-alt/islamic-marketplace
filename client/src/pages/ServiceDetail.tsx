import { useState } from "react";
import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar, Clock, MapPin, Star, Shield, CheckCircle, ArrowLeft, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import ReviewSection from "@/components/ReviewSection";

export default function ServiceDetail() {
  const [, params] = useRoute("/services/:id");
  const serviceId = parseInt(params?.id ?? "0");
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  const { data: service, isLoading } = trpc.services.getById.useQuery(
    { id: serviceId },
    { enabled: serviceId > 0 }
  );

  const createBookingMutation = trpc.bookings.create.useMutation({
    onSuccess: () => {
      toast.success("Booking confirmed! Check your bookings page.");
      setIsBooking(false);
    },
    onError: (e) => {
      toast.error(e.message);
      setIsBooking(false);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Service not found</h2>
          <Button asChild><Link href="/services">Back to Services</Link></Button>
        </div>
      </div>
    );
  }

  const price = Number(service.price);
  const depositAmount = service.depositAmount ? Number(service.depositAmount) : null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time");
      return;
    }
    setIsBooking(true);
    const scheduledAt = new Date(`${selectedDate}T${selectedTime}`);
    createBookingMutation.mutate({
      serviceId: service.id,
      scheduledAt: scheduledAt.toISOString(),
      notes: notes || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/services" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Services
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{service.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Info */}
          <div className="lg:col-span-2">
            <div className="aspect-video rounded-2xl overflow-hidden bg-secondary mb-6">
              {service.images && (service.images as string[]).length > 0 ? (
                <img src={(service.images as string[])[0]} alt={service.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5"><Calendar className="w-16 h-16 text-primary/40" /></div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {(service as unknown as { isHalal?: boolean }).isHalal && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Halal Service
                </Badge>
              )}
              {service.locationType && (
                <Badge variant="outline" className="capitalize">{service.locationType}</Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-3">{service.title}</h1>

            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-medium text-foreground">{service.rating ? Number(service.rating).toFixed(1) : "New"}</span>
                <span>({service.reviewCount ?? 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{service.duration} minutes</span>
              </div>
            </div>

            {service.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">{service.description}</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Verified Provider</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Flexible Scheduling</span>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div>
            <Card className="border-0 shadow-md sticky top-24">
              <CardContent className="p-6">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-primary">£{price.toFixed(2)}</span>
    
                </div>

                {depositAmount && service.requireDeposit && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <p className="text-xs text-amber-700">
                      <strong>Deposit required:</strong> £{depositAmount.toFixed(2)} to confirm booking
                    </p>
                  </div>
                )}

                <form onSubmit={handleBook} className="space-y-4">
                  <div>
                    <Label>Select Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label>Select Time</Label>
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label>Notes (optional)</Label>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any special requirements..."
                      className="mt-1"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={isBooking}>
                    {isBooking ? "Booking..." : isAuthenticated ? "Book Now" : "Sign In to Book"}
                  </Button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free cancellation 48+ hours before appointment
                </p>
                {isAuthenticated && (
                  <Button variant="outline" className="w-full mt-3" asChild>
                    <Link href="/messages">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Provider
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews */}
        {service && (
          <ReviewSection
            type="service"
            targetId={service.id}
            targetTitle={service.title}
          />
        )}
      </div>
    </div>
  );
}
