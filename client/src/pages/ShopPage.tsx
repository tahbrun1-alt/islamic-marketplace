import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, Phone, Mail, Globe, Instagram, Star, Package,
  Calendar, CheckCircle, ExternalLink, ArrowLeft, ShoppingBag,
  Shield, Award, Clock, Heart, Users
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import ReviewSection from "@/components/ReviewSection";

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState("products");
  const addItem = useCartStore((s) => s.addItem);
  const { isAuthenticated } = useAuth();

  const { data: shop, isLoading: shopLoading } = trpc.shops.getBySlug.useQuery(
    { slug: slug ?? "" },
    { enabled: !!slug }
  );

  const { data: products } = trpc.products.list.useQuery(
    { shopId: shop?.id, limit: 24 },
    { enabled: !!shop?.id }
  );

  const { data: services } = trpc.services.list.useQuery(
    { shopId: shop?.id, limit: 24 },
    { enabled: !!shop?.id }
  );

  const { data: isFollowing, refetch: refetchFollow } = trpc.follows.isFollowing.useQuery(
    { shopId: shop?.id ?? 0 },
    { enabled: !!shop?.id && isAuthenticated }
  );

  const followMutation = trpc.follows.follow.useMutation({
    onSuccess: () => { refetchFollow(); toast.success("Following " + shop?.name); },
  });
  const unfollowMutation = trpc.follows.unfollow.useMutation({
    onSuccess: () => { refetchFollow(); toast.success("Unfollowed " + shop?.name); },
  });

  const handleFollowToggle = () => {
    if (!isAuthenticated) { toast.error("Sign in to follow sellers"); return; }
    if (!shop) return;
    if (isFollowing) {
      unfollowMutation.mutate({ shopId: shop.id });
    } else {
      followMutation.mutate({ shopId: shop.id });
    }
  };

  if (shopLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center pattern-bg">
        <div className="text-center bg-white rounded-2xl p-10 shadow-xl max-w-sm mx-4">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Shop Not Found</h2>
          <p className="text-muted-foreground text-sm mb-6">This shop doesn't exist or may have been removed.</p>
          <Button asChild variant="outline">
            <Link href="/sellers"><ArrowLeft className="w-4 h-4 mr-2" /> Browse Sellers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isInTrial = shop.trialEndsAt && new Date() < new Date(shop.trialEndsAt);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div
        className="h-48 sm:h-64 w-full relative overflow-hidden"
        style={{
          background: shop.banner
            ? `url(${shop.banner}) center/cover no-repeat`
            : "linear-gradient(135deg, oklch(0.18 0.025 40) 0%, oklch(0.32 0.04 55) 100%)"
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-4 left-4">
          <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
            <Link href="/sellers"><ArrowLeft className="w-4 h-4 mr-1" /> All Sellers</Link>
          </Button>
        </div>
      </div>

      {/* Shop Header */}
      <div className="container">
        <div className="relative -mt-12 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white flex items-center justify-center shrink-0">
              {shop.logo ? (
                <img src={shop.logo} alt={shop.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-primary bg-primary/10">
                  {shop.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{shop.name}</h1>
                {shop.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700 gap-1">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </Badge>
                )}
                {shop.isHalalCertified && (
                  <Badge className="bg-emerald-100 text-emerald-700 gap-1">
                    <Award className="w-3 h-3" /> Halal Certified
                  </Badge>
                )}
                {isInTrial && (
                  <Badge className="bg-amber-100 text-amber-700 gap-1">
                    <Clock className="w-3 h-3" /> Free Trial
                  </Badge>
                )}
              </div>

              {shop.description && (
                <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">{shop.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mt-2">
                {shop.location && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" /> {shop.location}
                  </span>
                )}
                {shop.rating && Number(shop.rating) > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                    {Number(shop.rating).toFixed(1)} ({shop.reviewCount} reviews)
                  </span>
                )}
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <ShoppingBag className="w-3.5 h-3.5" /> {shop.totalSales} sales
                </span>
                {(shop as any).followerCount > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3.5 h-3.5" /> {(shop as any).followerCount} followers
                  </span>
                )}
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-wrap gap-2 pb-2">
              {/* Follow button */}
              <Button
                variant={isFollowing ? "default" : "outline"}
                size="sm"
                onClick={handleFollowToggle}
                disabled={followMutation.isPending || unfollowMutation.isPending}
                className={isFollowing ? "bg-primary text-primary-foreground" : ""}
              >
                <Heart className={`w-4 h-4 mr-1 ${isFollowing ? "fill-current" : ""}`} />
                {isFollowing ? "Following" : "Follow"}
              </Button>
              {shop.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={shop.website} target="_blank" rel="noopener noreferrer">
                    <Globe className="w-4 h-4 mr-1" /> Website
                  </a>
                </Button>
              )}
              {shop.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://instagram.com/${shop.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-4 h-4 mr-1" /> Instagram
                  </a>
                </Button>
              )}
              {shop.email && (
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${shop.email}`}>
                    <Mail className="w-4 h-4 mr-1" /> Contact
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="products">
              Products {products && products.length > 0 && <Badge className="ml-1.5 text-xs">{products.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="services">
              Services {services && services.length > 0 && <Badge className="ml-1.5 text-xs">{services.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Products */}
          <TabsContent value="products">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product, i) => {
                  const images = product.images as string[] | null;
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                        <Link href={`/products/${product.id}`}>
                          <div className="aspect-square bg-secondary overflow-hidden">
                            {images?.[0] ? (
                              <img src={images[0]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Package className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                        </Link>
                        <CardContent className="p-3">
                          <Link href={`/products/${product.id}`}>
                            <p className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">{product.title}</p>
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary">£{Number(product.price).toFixed(2)}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => {
                                addItem({ productId: product.id, title: product.title, price: Number(product.price), image: images?.[0] });
                                toast.success("Added to cart");
                              }}
                            >
                              <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Add
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No products listed yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Services */}
          <TabsContent value="services">
            {services && services.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service, i) => {
                  const images = service.images as string[] | null;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                        <Link href={`/services/${service.id}`}>
                          <div className="h-40 bg-secondary overflow-hidden">
                            {images?.[0] ? (
                              <img src={images[0]} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Calendar className="w-8 h-8" />
                              </div>
                            )}
                          </div>
                        </Link>
                        <CardContent className="p-4">
                          <Link href={`/services/${service.id}`}>
                            <p className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">{service.title}</p>
                          </Link>
                          {service.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="font-bold text-primary">
                              from £{Number(service.basePrice).toFixed(2)}
                            </span>
                            <Button size="sm" asChild>
                              <Link href={`/services/${service.id}`}>Book</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No services listed yet.</p>
              </div>
            )}
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <ReviewSection
              type="shop"
              targetId={shop.id}
              targetTitle={shop.name}
            />
          </TabsContent>

          {/* About */}
          <TabsContent value="about">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" /> Shop Details
                  </h3>
                  <div className="space-y-3">
                    {shop.location && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground">{shop.location}</span>
                      </div>
                    )}
                    {shop.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-sm text-foreground">{shop.phone}</span>
                      </div>
                    )}
                    {shop.email && (
                      <div className="flex items-start gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <a href={`mailto:${shop.email}`} className="text-sm text-primary hover:underline">{shop.email}</a>
                      </div>
                    )}
                    {shop.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <a href={shop.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                          {shop.website} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground">Member since {new Date(shop.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {shop.policies && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="font-bold text-foreground mb-4">Shop Policies</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{shop.policies}</p>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Sadaqah Contribution
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Every purchase from this shop automatically donates <strong>0.5%</strong> to verified Islamic charities through Noor Marketplace's built-in Sadaqah programme. Shop with confidence knowing your purchase does good.
                  </p>
                  <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <p className="text-xs text-rose-700 italic">"Charity does not decrease wealth." — Prophet Muhammad ﷺ (Sahih Muslim)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
