import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, Heart, Star, ShoppingCart, X, Filter } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { Link } from "wouter";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Modest Fashion", value: "modest-fashion" },
  { label: "Abayas & Jilbabs", value: "abayas-jilbabs" },
  { label: "Prayer Items", value: "prayer-items" },
  { label: "Qurans & Books", value: "qurans-books" },
  { label: "Islamic Art", value: "islamic-art" },
  { label: "Perfumes & Attar", value: "perfumes-attar" },
  { label: "Gifts & Decor", value: "gifts-decor" },
  { label: "Ramadan & Eid", value: "ramadan-eid" },
  { label: "Hajj & Umrah", value: "hajj-umrah" },
  { label: "Digital Downloads", value: "digital-downloads" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
];

export default function Products() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [gender, setGender] = useState("");
  const [page, setPage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  // Parse URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const cat = params.get("category");
    if (q) { setSearch(q); setDebouncedSearch(q); }
    if (cat) setCategory(cat);
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: products, isLoading } = trpc.products.list.useQuery({
    search: debouncedSearch || undefined,
    sortBy,
    limit: 24,
    offset: page * 24,
  });

  const handleAddToCart = (product: typeof products extends (infer T)[] | undefined ? T : never) => {
    if (!product) return;
    addItem({
      productId: product.id,
      shopId: product.shopId,
      title: product.title,
      price: Number(product.price),
      image: (product.images as string[])?.[0],
      quantity: 1,
      type: product.type as "physical" | "digital",
    });
    toast.success("Added to cart!", { description: product.title });
  };

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-sm mb-3 text-foreground">Category</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
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
        <h3 className="font-semibold text-sm mb-3 text-foreground">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={5}
          className="mb-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>£{priceRange[0]}</span>
          <span>£{priceRange[1]}+</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-sm mb-3 text-foreground">Gender</h3>
        <div className="flex flex-wrap gap-2">
          {["All", "Female", "Male", "Children"].map((g) => (
            <button
              key={g}
              onClick={() => setGender(g === "All" ? "" : g.toLowerCase())}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                (g === "All" && !gender) || gender === g.toLowerCase()
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary text-foreground"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => { setCategory(""); setPriceRange([0, 500]); setGender(""); setSearch(""); }}
      >
        <X className="w-4 h-4 mr-2" /> Clear Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-[105px] z-30">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="pl-9 rounded-full"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 hidden sm:flex">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterPanel />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Active filters */}
          {(category || gender || debouncedSearch) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {category && (
                <Badge variant="secondary" className="gap-1">
                  {CATEGORIES.find((c) => c.value === category)?.label}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setCategory("")} />
                </Badge>
              )}
              {gender && (
                <Badge variant="secondary" className="gap-1">
                  {gender}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setGender("")} />
                </Badge>
              )}
              {debouncedSearch && (
                <Badge variant="secondary" className="gap-1">
                  "{debouncedSearch}"
                  <X className="w-3 h-3 cursor-pointer" onClick={() => { setSearch(""); setDebouncedSearch(""); }} />
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="container py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-44 bg-white rounded-xl border border-border p-4">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden bg-white border border-border animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-4 bg-muted rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">{products.length} products found</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="product-card rounded-xl overflow-hidden bg-white border border-border group">
                        <Link href={`/products/${product.id}`}>
                          <div className="aspect-square bg-secondary overflow-hidden relative cursor-pointer">
                            {(product.images as string[])?.[0] ? (
                              <img
                                src={(product.images as string[])[0]}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                            )}
                            {product.comparePrice && (
                              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
                                Sale
                              </Badge>
                            )}
                            <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                              <Heart className="w-4 h-4 text-muted-foreground hover:text-rose-500 transition-colors" />
                            </button>
                          </div>
                        </Link>
                        <div className="p-3">
                          <Link href={`/products/${product.id}`}>
                            <p className="text-sm font-medium line-clamp-2 mb-1 text-foreground hover:text-primary cursor-pointer">{product.title}</p>
                          </Link>
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex gap-0.5">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} className={`w-3 h-3 ${s <= Number(product.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">({product.reviewCount ?? 0})</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-bold text-primary">£{Number(product.price).toFixed(2)}</p>
                              {product.comparePrice && (
                                <p className="text-xs text-muted-foreground line-through">£{Number(product.comparePrice).toFixed(2)}</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                              onClick={() => handleAddToCart(product)}
                            >
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-8">
                  <Button variant="outline" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <Button variant="outline" disabled={products.length < 24} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold mb-2 text-foreground">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <Button onClick={() => { setSearch(""); setCategory(""); setGender(""); }}>Clear All Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
