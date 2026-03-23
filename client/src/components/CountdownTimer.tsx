import { useState, useEffect } from "react";
import { Clock, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownEvent {
  name: string;
  date: Date;
  emoji: string;
  color: string;
  bgColor: string;
  message: string;
  ctaText: string;
  ctaLink: string;
}

// Islamic events for 2026
const ISLAMIC_EVENTS: CountdownEvent[] = [
  {
    name: "Eid al-Fitr 2026",
    date: new Date("2026-03-30T00:00:00"),
    emoji: "🌙",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    message: "Order now for guaranteed Eid delivery!",
    ctaText: "Shop Eid Gifts",
    ctaLink: "/products?occasion=eid",
  },
  {
    name: "Eid al-Adha 2026",
    date: new Date("2026-06-06T00:00:00"),
    emoji: "🐑",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    message: "Prepare for Eid al-Adha celebrations!",
    ctaText: "Shop Now",
    ctaLink: "/products?occasion=eid-adha",
  },
  {
    name: "Ramadan 2027",
    date: new Date("2027-02-17T00:00:00"),
    emoji: "✨",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
    message: "Get your Ramadan essentials early!",
    ctaText: "Ramadan Shop",
    ctaLink: "/products?occasion=ramadan",
  },
];

function getNextEvent(): CountdownEvent {
  const now = new Date();
  const upcoming = ISLAMIC_EVENTS.filter((e) => e.date > now);
  return upcoming.length > 0 ? upcoming[0] : ISLAMIC_EVENTS[0];
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

interface CountdownTimerProps {
  compact?: boolean;
  showOnProductPage?: boolean;
  productId?: number;
}

export function CountdownTimer({ compact = false, showOnProductPage = false }: CountdownTimerProps) {
  const event = getNextEvent();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(event.date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event.date));
    }, 1000);
    return () => clearInterval(timer);
  }, [event.date]);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${event.bgColor} text-sm`}>
        <Clock className={`h-4 w-4 ${event.color}`} />
        <span className={`font-medium ${event.color}`}>
          {event.emoji} {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m until {event.name}
        </span>
      </div>
    );
  }

  if (showOnProductPage) {
    return (
      <div className={`rounded-xl border-2 p-4 ${event.bgColor}`}>
        <div className="flex items-center gap-2 mb-3">
          <Truck className={`h-5 w-5 ${event.color}`} />
          <span className={`font-bold text-sm ${event.color}`}>
            {event.emoji} {event.message}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-2 mb-3">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Mins", value: timeLeft.minutes },
            { label: "Secs", value: timeLeft.seconds },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className={`text-2xl font-bold ${event.color}`}>
                {String(value).padStart(2, "0")}
              </div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          <Package className="inline h-3 w-3 mr-1" />
          Order within {timeLeft.days} days to receive before {event.name}
        </p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border-2 p-6 ${event.bgColor}`}>
      <div className="text-center mb-4">
        <Badge variant="secondary" className="mb-2">
          {event.emoji} Limited Time
        </Badge>
        <h3 className={`text-xl font-bold ${event.color}`}>
          {event.name} Countdown
        </h3>
        <p className="text-sm text-muted-foreground mt-1">{event.message}</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Days", value: timeLeft.days },
          { label: "Hours", value: timeLeft.hours },
          { label: "Minutes", value: timeLeft.minutes },
          { label: "Seconds", value: timeLeft.seconds },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="bg-white rounded-xl p-3 text-center shadow-sm border"
          >
            <div className={`text-3xl font-bold ${event.color}`}>
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Link href={event.ctaLink}>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white w-full">
            {event.ctaText} →
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">
          Free UK delivery on orders over £30
        </p>
      </div>
    </div>
  );
}

export function CountdownBanner() {
  const event = getNextEvent();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(event.date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(event.date));
    }, 1000);
    return () => clearInterval(timer);
  }, [event.date]);

  return (
    <div className="bg-amber-500 text-white py-2 px-4 text-center text-sm">
      <span className="font-medium">
        {event.emoji} {event.name} in{" "}
        <strong>
          {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
        </strong>{" "}
        — {event.message}
      </span>
      <Link href={event.ctaLink}>
        <span className="ml-2 underline cursor-pointer font-bold">
          Shop Now →
        </span>
      </Link>
    </div>
  );
}
