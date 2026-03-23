import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingCart,
  Heart,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  Store,
  Calendar,
  User,
  Settings,
  LogOut,
  Shield,
  Star,
  Package,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Shirt,
  Circle,
  Palette,
  FlaskConical,
  Gift,
  Moon,
  MapPin,
  Download,
  GraduationCap,
  Activity,
  Scissors,
  Camera,
  Utensils,
  Languages,
  Leaf,
  LucideIcon,
  Sparkles,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCartStore } from "@/stores/cartStore";

// Custom Ring icon since it's missing from lucide-react
const Ring = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="14" r="7" />
    <path d="M12 7V2" />
    <path d="M9 4h6" />
  </svg>
);

const productCategories: { name: string; slug: string; Icon: LucideIcon }[] = [
  { name: "Modest Fashion",    slug: "modest-fashion",    Icon: Shirt },
  { name: "Abayas & Jilbabs", slug: "abayas-jilbabs",    Icon: Shirt },
  { name: "Prayer Items",      slug: "prayer-items",      Icon: Circle },
  { name: "Qurans & Books",    slug: "qurans-books",      Icon: BookOpen },
  { name: "Islamic Art",       slug: "islamic-art",       Icon: Palette },
  { name: "Perfumes & Attar",  slug: "perfumes-attar",    Icon: FlaskConical },
  { name: "Gifts & Decor",     slug: "gifts-decor",       Icon: Gift },
  { name: "Ramadan & Eid",     slug: "ramadan-eid",       Icon: Moon },
  { name: "Hajj & Umrah",      slug: "hajj-umrah",        Icon: MapPin },
  { name: "Digital Downloads", slug: "digital-downloads", Icon: Download },
];

const serviceCategories: { name: string; slug: string; Icon: LucideIcon }[] = [
  { name: "Quran Tutoring",      slug: "quran-tutoring",      Icon: GraduationCap },
  { name: "Hijama Therapy",      slug: "hijama-therapy",      Icon: Activity },
  { name: "Islamic Counselling", slug: "islamic-counselling", Icon: MessageSquare },
  { name: "Event Services",      slug: "event-services",      Icon: Calendar },
  { name: "Tailoring",           slug: "tailoring",           Icon: Scissors },
  { name: "Photography",         slug: "photography",         Icon: Camera },
  { name: "Halal Catering",      slug: "halal-catering",      Icon: Utensils },
  { name: "Arabic Lessons",      slug: "arabic-lessons",      Icon: Languages },
  { name: "Henna & Beauty",      slug: "henna-beauty",        Icon: Leaf },
  { name: "Nikah Services",      slug: "nikah-services",      Icon: Ring },
];

const ADMIN_EMAIL = "tahmidburner12@gmail.com";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const isAdmin = user?.role === "admin" && user?.email === ADMIN_EMAIL;

  const { data: notifData } = trpc.notifications.getUnreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
  const unreadCount = notifData?.count ?? 0;

  // Live global search — debounced 300ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const { data: searchResults } = trpc.search.global.useQuery(
    { q: debouncedQuery, limit: 4 },
    { enabled: debouncedQuery.trim().length >= 2 }
  );

  const showDropdown = searchFocused && debouncedQuery.trim().length >= 2 && !!searchResults;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchFocused(false);
      window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const handleResultClick = () => {
    setSearchFocused(false);
    setSearchQuery("");
    setDebouncedQuery("");
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="text-center py-2 text-xs font-medium tracking-wide" style={{ background: "linear-gradient(90deg, oklch(0.15 0.020 45), oklch(0.12 0.015 40), oklch(0.15 0.020 45))", color: "oklch(0.92 0.14 86)" }}>
        <span className="font-arabic text-sm mr-2">بسم الله</span>
        Free for 14 days — then just 7% commission (incl. 0.5% auto-donated to charity ️). Join the Ummah marketplace today!
      </div>

      <nav
        className={`sticky top-0 z-50 bg-card/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "shadow-[0_1px_0_0_var(--color-border),0_4px_20px_oklch(0.18_0.025_40/0.08)]" : "border-b border-border"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }}>
                ن
              </div>
              <div className="hidden sm:block">
                <div className="font-serif font-semibold text-lg leading-tight text-foreground tracking-tight">
                  Noor
                </div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase leading-tight -mt-0.5">Marketplace</div>
              </div>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search products, services, shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
              {/* Live search dropdown */}
              {showDropdown && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-card border border-border rounded-xl shadow-elegant z-50 overflow-hidden">
                  {searchResults.products.length === 0 && searchResults.services.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-muted-foreground">No results for "{debouncedQuery}"</div>
                  ) : (
                    <>
                      {searchResults.products.length > 0 && (
                        <div>
                          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Package className="w-3 h-3" /> Products
                          </div>
                          {searchResults.products.map((p: any) => (
                            <Link
                              key={p.id}
                              href={`/products/${p.id}`}
                              onClick={handleResultClick}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-secondary transition-colors"
                            >
                              <div className="w-9 h-9 rounded-lg bg-secondary overflow-hidden shrink-0">
                                {(p.images as string[])?.[0]
                                  ? <img src={(p.images as string[])[0]} alt="" className="w-full h-full object-cover" />
                                  : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-muted-foreground" /></div>
                                }
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                                <p className="text-xs text-primary">£{Number(p.price).toFixed(2)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.services.length > 0 && (
                        <div className="border-t border-border">
                          <div className="px-3 pt-2 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" /> Services
                          </div>
                          {searchResults.services.map((s: any) => (
                            <Link
                              key={s.id}
                              href={`/services/${s.id}`}
                              onClick={handleResultClick}
                              className="flex items-center gap-3 px-3 py-2 hover:bg-secondary transition-colors"
                            >
                              <div className="w-9 h-9 rounded-lg bg-secondary overflow-hidden shrink-0 flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{s.title}</p>
                                <p className="text-xs text-muted-foreground">from £{Number(s.basePrice ?? s.price ?? 0).toFixed(2)}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </form>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none">
                  Products <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-elegant">
                  <div className="grid grid-cols-1 gap-1">
                    {productCategories.map((cat) => (
                      <Link key={cat.slug} href={`/products?category=${cat.slug}`}>
                        <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                            <cat.Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{cat.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                    <DropdownMenuSeparator className="my-1" />
                    <Link href="/products">
                      <DropdownMenuItem className="flex items-center justify-center p-2 rounded-lg cursor-pointer text-primary font-semibold text-xs uppercase tracking-wider">
                        View All Products
                      </DropdownMenuItem>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors outline-none">
                  Services <ChevronDown className="w-3.5 h-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-elegant">
                  <div className="grid grid-cols-1 gap-1">
                    {serviceCategories.map((cat) => (
                      <Link key={cat.slug} href={`/services?category=${cat.slug}`}>
                        <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                            <cat.Icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium">{cat.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                    <DropdownMenuSeparator className="my-1" />
                    <Link href="/services">
                      <DropdownMenuItem className="flex items-center justify-center p-2 rounded-lg cursor-pointer text-primary font-semibold text-xs uppercase tracking-wider">
                        View All Services
                      </DropdownMenuItem>
                    </Link>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/sellers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Sellers
              </Link>
              <Link href="/categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </Link>
              <Link href="/start-selling" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                Sell
              </Link>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/wishlist" className="hidden sm:flex relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="w-5 h-5" />
              </Link>

              <Link href="/cart" className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-0.5 -right-0.5 w-4 h-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-2 border-card">
                    {cartCount}
                  </Badge>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link href="/messages" className="hidden sm:flex relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </Link>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                      <Avatar className="w-8 h-8 border border-border hover:border-primary transition-colors cursor-pointer">
                        <AvatarImage src={user?.avatarUrl ?? ""} />
                        <AvatarFallback className="bg-secondary text-xs font-bold">
                          {user?.name?.charAt(0).toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-elegant">
                      <div className="px-2 py-1.5 mb-1">
                        <p className="text-sm font-bold text-foreground truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <Link href="/profile">
                        <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">My Account</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/orders">
                        <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                          <Package className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">My Orders</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/bookings">
                        <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">My Bookings</span>
                        </DropdownMenuItem>
                      </Link>
                      <Link href="/messages">
                        <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Messages</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      {user?.role === "seller" && (
                        <Link href="/seller/dashboard">
                          <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                            <Store className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary">Seller Dashboard</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      {isAdmin && (
                        <Link href="/admin">
                          <DropdownMenuItem className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors">
                            <Shield className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-bold text-amber-600">Admin Panel</span>
                          </DropdownMenuItem>
                        </Link>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => logout()}
                        className="flex items-center gap-3 p-2 rounded-lg cursor-pointer text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Log Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="hidden sm:flex text-sm font-medium">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="text-sm font-bold rounded-full px-5 shadow-elegant">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="container py-6 space-y-6">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-secondary text-sm focus:outline-none"
                  />
                </form>

                <div className="grid grid-cols-2 gap-4">
                  <Link href="/products" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors">
                    <Package className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold">Products</span>
                  </Link>
                  <Link href="/services" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors">
                    <Calendar className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold">Services</span>
                  </Link>
                  <Link href="/sellers" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors">
                    <Store className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold">Sellers</span>
                  </Link>
                  <Link href="/categories" onClick={() => setMobileOpen(false)} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <span className="text-sm font-bold">Categories</span>
                  </Link>
                </div>

                <div className="space-y-1">
                  <Link href="/start-selling" onClick={() => setMobileOpen(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors">
                    <span className="font-bold text-primary">Start Selling on Noor</span>
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </Link>
                  <Link href="/how-it-works" onClick={() => setMobileOpen(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors">
                    <span className="font-medium">How It Works</span>
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </Link>
                  <Link href="/halal-standards" onClick={() => setMobileOpen(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary transition-colors">
                    <span className="font-medium">Halal Standards</span>
                    <ChevronDown className="w-4 h-4 -rotate-90" />
                  </Link>
                </div>

                {!isAuthenticated && (
                  <div className="flex flex-col gap-3 pt-4 border-t border-border">
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full rounded-xl py-6 font-bold">Log In</Button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full rounded-xl py-6 font-bold shadow-elegant">Get Started</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
