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
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCartStore } from "@/stores/cartStore";

const productCategories = [
  { name: "Modest Fashion", slug: "modest-fashion", icon: "👗" },
  { name: "Abayas & Jilbabs", slug: "abayas-jilbabs", icon: "🧕" },
  { name: "Prayer Items", slug: "prayer-items", icon: "🕌" },
  { name: "Qurans & Books", slug: "qurans-books", icon: "📖" },
  { name: "Islamic Art", slug: "islamic-art", icon: "🎨" },
  { name: "Perfumes & Attar", slug: "perfumes-attar", icon: "🌹" },
  { name: "Gifts & Decor", slug: "gifts-decor", icon: "🎁" },
  { name: "Ramadan & Eid", slug: "ramadan-eid", icon: "🌙" },
  { name: "Hajj & Umrah", slug: "hajj-umrah", icon: "🕋" },
  { name: "Digital Downloads", slug: "digital-downloads", icon: "💾" },
];

const serviceCategories = [
  { name: "Quran Tutoring", slug: "quran-tutoring", icon: "📖" },
  { name: "Hijama Therapy", slug: "hijama-therapy", icon: "⚕️" },
  { name: "Islamic Counselling", slug: "islamic-counselling", icon: "💬" },
  { name: "Event Services", slug: "event-services", icon: "🎉" },
  { name: "Tailoring", slug: "tailoring", icon: "🧵" },
  { name: "Photography", slug: "photography", icon: "📸" },
  { name: "Halal Catering", slug: "halal-catering", icon: "🍽️" },
  { name: "Arabic Lessons", slug: "arabic-lessons", icon: "🔤" },
  { name: "Henna & Beauty", slug: "henna-beauty", icon: "💅" },
  { name: "Nikah Services", slug: "nikah-services", icon: "💒" },
];

const ADMIN_EMAIL = "tahmidburner12@gmail.com";

export default function Navbar() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const isAdmin = user?.role === "admin" && user?.email === ADMIN_EMAIL;

  const { data: notifData } = trpc.notifications.getUnreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 30000,
  });
  const unreadCount = notifData?.count ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="text-center py-2 text-xs font-medium tracking-wide" style={{ background: "linear-gradient(90deg, oklch(0.15 0.020 45), oklch(0.12 0.015 40), oklch(0.15 0.020 45))", color: "oklch(0.92 0.14 86)" }}>
        <span className="font-arabic text-sm mr-2">بسم الله</span>
        Free for 14 days — then just 7% commission (incl. 0.5% auto-donated to charity ❤️). Join the Ummah marketplace today!
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
                  className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </form>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Products Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 font-medium">
                    <Package className="w-4 h-4" />
                    Products
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="start">
                  <div className="grid grid-cols-2 gap-1">
                    {productCategories.map((cat) => (
                      <DropdownMenuItem key={cat.slug} asChild>
                        <Link href={`/products?category=${cat.slug}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/products" className="flex items-center gap-2 font-medium text-primary cursor-pointer">
                      View All Products →
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1 font-medium">
                    <Calendar className="w-4 h-4" />
                    Services
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2" align="start">
                  <div className="grid grid-cols-2 gap-1">
                    {serviceCategories.map((cat) => (
                      <DropdownMenuItem key={cat.slug} asChild>
                        <Link href={`/services?category=${cat.slug}`} className="flex items-center gap-2 px-2 py-1.5 rounded text-sm cursor-pointer">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/services" className="flex items-center gap-2 font-medium text-primary cursor-pointer">
                      View All Services →
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="ghost" size="sm" asChild>
                <Link href="/sellers">Sellers</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/seller/dashboard" className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Sell
                </Link>
              </Button>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-5 h-5" />
              </Button>

              {isAuthenticated ? (
                <>
                  {/* Messages */}
                  <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                    <Link href="/messages">
                      <MessageSquare className="w-5 h-5" />
                    </Link>
                  </Button>

                  {/* Wishlist */}
                  <Button variant="ghost" size="icon" asChild className="hidden sm:flex">
                    <Link href="/wishlist">
                      <Heart className="w-5 h-5" />
                    </Link>
                  </Button>

                  {/* Notifications */}
                  <Button variant="ghost" size="icon" className="relative hidden sm:flex" asChild>
                    <Link href="/notifications">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
                      )}
                    </Link>
                  </Button>

                  {/* Cart */}
                  <Button variant="ghost" size="icon" className="relative" asChild>
                    <Link href="/cart">
                      <ShoppingCart className="w-5 h-5" />
                      {cartCount > 0 && (
                        <span className="notification-badge">{cartCount > 9 ? "9+" : cartCount}</span>
                      )}
                    </Link>
                  </Button>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user?.avatar ?? undefined} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="font-medium text-sm">{user?.name ?? "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="cursor-pointer">
                          <User className="w-4 h-4 mr-2" /> My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="cursor-pointer">
                          <Package className="w-4 h-4 mr-2" /> My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/bookings" className="cursor-pointer">
                          <Calendar className="w-4 h-4 mr-2" /> My Bookings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist" className="cursor-pointer">
                          <Heart className="w-4 h-4 mr-2" /> Wishlist
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/messages" className="cursor-pointer">
                          <MessageSquare className="w-4 h-4 mr-2" /> Messages
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/seller/dashboard" className="cursor-pointer">
                          <Store className="w-4 h-4 mr-2" /> Seller Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/seller/create" className="cursor-pointer">
                          <Star className="w-4 h-4 mr-2" /> Open a Shop
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="cursor-pointer text-primary">
                              <Shield className="w-4 h-4 mr-2" /> Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account/settings" className="cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" /> Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="text-primary-foreground hover:opacity-90" style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }}>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden pb-3 overflow-hidden"
              >
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search products, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-full border border-border bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    autoFocus
                  />
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="container py-4 space-y-1">
                <Link
                  href="/products"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium"
                >
                  <Package className="w-4 h-4 text-primary" /> All Products
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium"
                >
                  <Calendar className="w-4 h-4 text-primary" /> All Services
                </Link>
                <Link
                  href="/sellers"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm font-medium"
                >
                  <Store className="w-4 h-4 text-primary" /> Sellers
                </Link>
                {isAuthenticated ? (
                  <>
                    <hr className="my-2" />
                    <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">
                      <User className="w-4 h-4" /> My Account
                    </Link>
                    <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">
                      <Package className="w-4 h-4" /> My Orders
                    </Link>
                    <Link href="/bookings" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">
                      <Calendar className="w-4 h-4" /> My Bookings
                    </Link>
                    <Link href="/messages" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">
                      <MessageSquare className="w-4 h-4" /> Messages
                    </Link>
                    <Link href="/seller/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm">
                      <Store className="w-4 h-4" /> Seller Dashboard
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm text-primary font-medium">
                        <Shield className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary text-sm text-destructive w-full">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <hr className="my-2" />
                    <Link href="/login" className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                      Sign In / Get Started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
