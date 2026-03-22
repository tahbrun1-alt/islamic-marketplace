import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, Star, MapPin, Package, Search, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Sellers() {
  const [search, setSearch] = useState("");
  const { data: shops, isLoading } = trpc.shops.list.useQuery({ limit: 50 });

  const filtered = shops?.filter((s) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || (s.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="hero-gradient py-12 text-white text-center">
        <div className="container">
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our Sellers
          </h1>
          <p className="text-white/80 mb-6">Discover verified Muslim sellers from around the world</p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sellers..."
              className="pl-9 bg-white text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="container py-8">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-white rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered && filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((shop, i) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                        {shop.logo ? (
                          <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          "🏪"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                            {shop.name}
                          </h3>
                          {shop.isVerified && (
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          )}
                        </div>
                        {shop.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{shop.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {shop.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{shop.description}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium text-foreground">
                          {shop.rating ? Number(shop.rating).toFixed(1) : "New"}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {(shop as unknown as { shopType?: string }).shopType === "products" ? "Products" : (shop as unknown as { shopType?: string }).shopType === "services" ? "Services" : "Marketplace"}
                      </Badge>
                    </div>

                    <Button size="sm" variant="outline" className="w-full mt-3 text-xs" asChild>
                      <Link href={`/products?shop=${shop.id}`}>
                        <Package className="w-3.5 h-3.5 mr-1.5" /> View Shop
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Store className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-xl font-bold mb-2 text-foreground">No sellers found</h3>
            <p className="text-muted-foreground">Be the first to open a shop!</p>
            <Button className="mt-4" asChild>
              <Link href="/seller/dashboard">Open Your Shop</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
