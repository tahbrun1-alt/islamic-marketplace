import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, Star, Clock, MapPin, Filter, X, Calendar } from "lucide-react";
import { Link } from "wouter";

const SERVICE_CATEGORIES = [
  { label: "All Services", value: "" },
  { label: "Quran Tutoring", value: "quran-tutoring" },
  { label: "Hijama Therapy", value: "hijama-therapy" },
  { label: "Islamic Counselling", value: "islamic-counselling" },
  { label: "Event Services", value: "event-services" },
  { label: "Tailoring", value: "tailoring" },
  { label: "Photography", value: "photography" },
  { label: "Halal Catering", value: "halal-catering" },
  { label: "Arabic Lessons", value: "arabic-lessons" },
  { label: "Henna & Beauty", value: "henna-beauty" },
  { label: "Nikah Services", value: "nikah-services" },
];

const LOCATION_TYPES = [
  { label: "All Locations", value: "" },
  { label: "Online", value: "online" },
  { label: "In Person", value: "in_person" },
  { label: "At Client", value: "at_client" },
  { label: "At Provider", value: "at_provider" },
];

export default function Services() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [locationType, setLocationType] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const cat = params.get("category");
    if (q) { setSearch(q); setDebouncedSearch(q); }
    if (cat) setCategory(cat);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: services, isLoading } = trpc.services.list.useQuery({
    search: debouncedSearch || undefined,
    locationType: locationType || undefined,
    limit: 24,
    offset: page * 24,
  });

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3 text-foreground">Category</h3>
        <div className="space-y-1">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === cat.value
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3 text-foreground">Location Type</h3>
        <div className="space-y-1">
          {LOCATION_TYPES.map((loc) => (
            <button
              key={loc.value}
              onClick={() => setLocationType(loc.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                locationType === loc.value
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-secondary text-foreground"
              }`}
            >
              {loc.label}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => { setCategory(""); setLocationType(""); setSearch(""); }}
      >
        <X className="w-4 h-4 mr-2" /> Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 py-10">
        <div className="container text-center">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">Islamic Services</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Book trusted Muslim professionals for Quran tutoring, hijama, counselling, catering, and more.
          </p>
        </div>
      </div>

      {/* Sticky Search Bar */}
      <div className="bg-white border-b border-border sticky top-[105px] z-30">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="pl-9 rounded-full"
              />
            </div>
            <Select value={locationType} onValueChange={setLocationType}>
              <SelectTrigger className="w-40 hidden sm:flex">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_TYPES.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value || "all"}>{loc.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                <div className="mt-6"><FilterPanel /></div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-44 bg-white rounded-xl border border-border p-4">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filters
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Services Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-white border border-border animate-pulse">
                    <div className="aspect-video bg-muted" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : services && services.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">{services.length} services found</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service, i) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link href={`/services/${service.id}`}>
                        <div className="product-card rounded-xl overflow-hidden bg-white border border-border cursor-pointer group h-full">
                          <div className="aspect-video bg-secondary overflow-hidden relative">
                            {(service.images as string[])?.[0] ? (
                              <img
                                src={(service.images as string[])[0]}
                                alt={service.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-primary/10 to-accent/10">🌟</div>
                            )}
                            {service.requireDeposit && (
                              <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-xs">Deposit Required</Badge>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">{service.title}</p>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration} min</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {service.locationType.replace(/_/g, " ")}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-bold text-primary">from £{Number(service.price).toFixed(2)}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span className="text-xs font-medium">{service.rating ? Number(service.rating).toFixed(1) : "New"}</span>
                                {service.reviewCount ? <span className="text-xs text-muted-foreground">({service.reviewCount})</span> : null}
                              </div>
                            </div>
                            <Button size="sm" className="w-full mt-3 bg-primary text-primary-foreground">
                              <Calendar className="w-3.5 h-3.5 mr-2" /> Book Now
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <Button variant="outline" disabled={services.length < 24} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">No services found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <Button onClick={() => { setSearch(""); setCategory(""); setLocationType(""); }}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
