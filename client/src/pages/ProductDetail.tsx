import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ShoppingCart, Star, Shield, Truck, ArrowLeft, Plus, Minus, CheckCircle, MessageSquare, Heart, Package } from "lucide-react";
import { trpc as trpcClient } from "@/lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { WhatsAppButton } from "@/components/WhatsAppFallback";
import ReviewSection from "@/components/ReviewSection";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = parseInt(params?.id ?? "0");
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});

  const { data: product, isLoading } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: productId > 0 }
  );

  const { data: shopData } = trpc.shops.getById.useQuery(
    { id: product?.shopId ?? 0 },
    { enabled: !!product?.shopId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-foreground">Product not found</h2>
          <Button asChild><Link href="/products">Back to Products</Link></Button>
        </div>
      </div>
    );
  }

  const images = (product.images as string[]) ?? [];
  const price = Number(product.price);
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : null;
  const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : null;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      shopId: product.shopId,
      title: product.title,
      price,
      image: images[0],
      quantity,
              type: product.type === "digital" ? "digital" : "physical",
    });
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Products
          </Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary mb-3">
              {images.length > 0 ? (
                <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted"><Package className="w-12 h-12 text-muted-foreground" /></div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${i === selectedImage ? "border-primary" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isHalal && (
                <Badge className="bg-emerald-100 text-emerald-700 border-0">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" /> Halal Certified
                </Badge>
              )}
              {product.type === "digital" && (
                <Badge className="bg-blue-100 text-blue-700 border-0">Digital Download</Badge>
              )}
              {discount && <Badge className="bg-red-100 text-red-700 border-0">{discount}% OFF</Badge>}
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-2">{product.title}</h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(Number(product.rating ?? 0)) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviewCount ?? 0} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">£{price.toFixed(2)}</span>
              {comparePrice && (
                <span className="text-lg text-muted-foreground line-through">£{comparePrice.toFixed(2)}</span>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Variation selectors */}
            {product.variations && (() => {
              type VariationGroup = { name: string; options: string[] };
              const vars = product.variations as VariationGroup[] | null;
              if (!vars || vars.length === 0) return null;
              return (
                <div className="space-y-4 mb-6">
                  {vars.map((group) => (
                    <div key={group.name}>
                      <p className="text-sm font-medium text-foreground mb-2">
                        {group.name}
                        {selectedVariations[group.name] && (
                          <span className="font-normal text-muted-foreground ml-2">— {selectedVariations[group.name]}</span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {group.options.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => setSelectedVariations((prev) => ({ ...prev, [group.name]: opt }))}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                              selectedVariations[group.name] === opt
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background text-foreground hover:border-primary/50"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-3 border border-border rounded-xl px-3 py-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-muted-foreground hover:text-foreground">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium text-foreground">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-muted-foreground hover:text-foreground">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
{product.inventory != null && product.inventory < 10 && product.inventory > 0 ? `Only ${product.inventory} left!` : product.inventory === 0 ? "Out of stock" : "In stock"}
              </span>
            </div>

            <div className="flex gap-3 mb-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.inventory === 0}
                style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
{product.inventory === 0 ? "Out of Stock" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline" onClick={() => { handleAddToCart(); navigate("/checkout"); }} disabled={product.inventory === 0}>
                Buy Now
              </Button>
            </div>
            {/* Contact seller */}
            <div className="flex gap-2 mb-6">
              {shopData?.phone && (
                <WhatsAppButton
                  sellerPhone={shopData.phone.replace(/[^0-9]/g, "")}
                  sellerName={shopData.name}
                  productName={product.title}
                  size="md"
                />
              )}
              {isAuthenticated && (
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Seller
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-muted-foreground">Buyer Protection</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                <Truck className="w-4 h-4 text-blue-500" />
                <span className="text-xs text-muted-foreground">Free delivery £50+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-4">
          <ReviewSection
            type="product"
            targetId={product.id}
            targetTitle={product.title}
          />
        </div>
      </div>
    </div>
  );
}
