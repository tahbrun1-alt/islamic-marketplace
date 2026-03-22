import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Heart, ShoppingCart, Trash2, Loader2, Package, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { getLoginUrl } from "@/const";

export default function Wishlist() {
  const { isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const { data: wishlistItems, isLoading } = trpc.wishlist.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const removeMutation = trpc.wishlist.remove.useMutation({
    onSuccess: () => {
      utils.wishlist.list.invalidate();
      toast.success("Removed from wishlist");
    },
    onError: () => toast.error("Failed to remove item"),
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-sm">
          <Heart className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Wishlist</h2>
          <p className="text-muted-foreground mb-6">Sign in to save your favourite products and services.</p>
          <Button asChild className="btn-gold">
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const products = (wishlistItems ?? []).filter((item: any) => item.product);
  const services = (wishlistItems ?? []).filter((item: any) => item.service);

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <Heart className="w-20 h-20 text-primary/20 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-3">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Browse our marketplace and save items you love. They'll appear here for easy access.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild className="btn-gold">
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/services">Browse Services</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="w-7 h-7 text-primary fill-primary" />
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">{wishlistItems.length} saved item{wishlistItems.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Products Section */}
        {products.length > 0 && (
          <section className="mb-10">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Saved Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {products.map((item: any) => {
                  const p = item.product;
                  const img = Array.isArray(p.images) ? p.images[0] : null;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      <Link href={`/products/${p.id}`}>
                        <div className="aspect-square bg-muted overflow-hidden">
                          {img ? (
                            <img src={img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/products/${p.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">{p.title}</h3>
                        </Link>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-primary">£{Number(p.price).toFixed(2)}</span>
                          <div className="flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => removeMutation.mutate({ productId: p.id })}
                              disabled={removeMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        {p.isHalalCertified && (
                          <Badge variant="outline" className="mt-2 text-xs border-primary/40 text-primary">
                            Halal Certified
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        )}

        {/* Services Section */}
        {services.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Saved Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {services.map((item: any) => {
                  const s = item.service;
                  const img = Array.isArray(s.images) ? s.images[0] : null;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow"
                    >
                      <Link href={`/services/${s.id}`}>
                        <div className="aspect-video bg-muted overflow-hidden">
                          {img ? (
                            <img src={img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sparkles className="w-12 h-12 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/services/${s.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2 mb-1">{s.title}</h3>
                        </Link>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-lg font-bold text-primary">£{Number(s.price).toFixed(2)}</span>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeMutation.mutate({ serviceId: s.id })}
                            disabled={removeMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
