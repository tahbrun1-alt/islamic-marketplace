import { useState } from "react";
import { motion } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link, useLocation } from "wouter";
import {
  Package, ShoppingBag, Star, TrendingUp, Plus, Edit, Trash2,
  Settings, BarChart3, MessageSquare, Calendar, Store, CheckCircle,
  Clock, AlertCircle, DollarSign
} from "lucide-react";

export default function SellerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: shop, refetch: refetchShop } = trpc.shops.myShop.useQuery(undefined, { enabled: isAuthenticated });
  const { data: stats } = trpc.shops.stats.useQuery(undefined, { enabled: isAuthenticated && !!shop });
  const { data: myProducts, refetch: refetchProducts } = trpc.products.list.useQuery(
    { shopId: shop?.id, limit: 50 },
    { enabled: !!shop?.id }
  );
  const { data: shopOrders } = trpc.orders.shopOrders.useQuery(undefined, { enabled: isAuthenticated && !!shop });
  const { data: providerBookings } = trpc.bookings.providerBookings.useQuery(undefined, { enabled: isAuthenticated });

  const createShopMutation = trpc.shops.create.useMutation({
    onSuccess: () => { toast.success("Shop created! Welcome to Noor Marketplace."); refetchShop(); },
    onError: (e) => toast.error(e.message),
  });

  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: () => { toast.success("Product removed"); refetchProducts(); },
    onError: (e) => toast.error(e.message),
  });

  const updateOrderMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: () => toast.success("Order status updated"),
    onError: (e) => toast.error(e.message),
  });

  const updateBookingMutation = trpc.bookings.updateStatus.useMutation({
    onSuccess: () => toast.success("Booking status updated"),
    onError: (e) => toast.error(e.message),
  });

  // Create shop form
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [shopLocation, setShopLocation] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Sign in to access your dashboard</h2>
          <p className="text-muted-foreground mb-6">Manage your shop, products, and orders</p>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center pattern-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Open Your Shop</h2>
            <p className="text-muted-foreground">Join 3,200+ Muslim sellers on Noor Marketplace. Free for 14 days, then just 6.5% commission.</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Shop Name *</Label>
              <Input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="e.g., Modest Threads by Fatima" className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={shopDesc} onChange={(e) => setShopDesc(e.target.value)} placeholder="Tell customers about your shop..." className="mt-1" rows={3} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={shopLocation} onChange={(e) => setShopLocation(e.target.value)} placeholder="e.g., London, UK" className="mt-1" />
            </div>
            <Button
              className="w-full"
              onClick={() => createShopMutation.mutate({ name: shopName, description: shopDesc, location: shopLocation })}
              disabled={!shopName || createShopMutation.isPending}
            >
              {createShopMutation.isPending ? "Creating..." : "Create My Shop — Free for 14 Days"}
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            {[{ icon: "🆓", label: "14-day free trial" }, { icon: "💰", label: "6.5% commission" }, { icon: "🌍", label: "Global reach" }].map((item) => (
              <div key={item.label}>
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  const isInTrial = shop.trialEndsAt && new Date() < new Date(shop.trialEndsAt);
  const trialDaysLeft = shop.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(shop.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">{shop.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge variant={shop.status === "active" ? "default" : "secondary"} className="text-xs">
                    {shop.status}
                  </Badge>
                  {shop.isVerified && <span className="verified-badge">✓ Verified</span>}
                  {isInTrial && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs">
                      {trialDaysLeft}d trial left
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/sellers/${shop.id}`}>View Shop</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("settings")}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Package, label: "Products", value: stats?.products ?? 0, color: "text-blue-600 bg-blue-50" },
            { icon: ShoppingBag, label: "Orders", value: stats?.orders ?? 0, color: "text-emerald-600 bg-emerald-50" },
            { icon: Calendar, label: "Bookings", value: stats?.bookings ?? 0, color: "text-purple-600 bg-purple-50" },
            { icon: Star, label: "Rating", value: shop.rating ? Number(shop.rating).toFixed(1) : "—", color: "text-amber-600 bg-amber-50" },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-primary" /> Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shopOrders && shopOrders.length > 0 ? (
                    <div className="space-y-3">
                      {shopOrders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-medium text-foreground">#{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">£{Number(order.total).toFixed(2)}</p>
                            <Badge variant="outline" className="text-xs">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
                  )}
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" /> Recent Bookings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {providerBookings && providerBookings.length > 0 ? (
                    <div className="space-y-3">
                      {providerBookings.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-medium text-foreground">#{booking.bookingNumber}</p>
                            <p className="text-xs text-muted-foreground">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">£{Number(booking.totalAmount).toFixed(2)}</p>
                            <Badge variant="outline" className="text-xs">{booking.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg text-foreground">My Products ({myProducts?.length ?? 0})</h2>
              <Button size="sm" asChild>
                <Link href="/seller/products/new">
                  <Plus className="w-4 h-4 mr-2" /> Add Product
                </Link>
              </Button>
            </div>

            {myProducts && myProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((product) => (
                  <Card key={product.id} className="border-0 shadow-sm overflow-hidden">
                    <div className="aspect-video bg-secondary relative overflow-hidden">
                      {(product.images as string[])?.[0] ? (
                        <img src={(product.images as string[])[0]} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                      )}
                      <Badge className={`absolute top-2 right-2 text-xs ${product.isActive ? "bg-emerald-500" : "bg-gray-400"}`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium text-sm line-clamp-1 text-foreground mb-1">{product.title}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-primary">£{Number(product.price).toFixed(2)}</p>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" asChild>
                            <Link href={`/seller/products/${product.id}/edit`}><Edit className="w-3.5 h-3.5" /></Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => deleteProductMutation.mutate({ id: product.id })}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Stock: {product.inventory}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-border">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2 text-foreground">No products yet</h3>
                <p className="text-muted-foreground mb-4">Add your first product to start selling</p>
                <Button asChild>
                  <Link href="/seller/products/new">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Orders ({shopOrders?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {shopOrders && shopOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Order #</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Total</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {shopOrders.map((order) => (
                          <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                            <td className="py-3 px-3 font-medium text-foreground">#{order.orderNumber}</td>
                            <td className="py-3 px-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-3 font-bold text-primary">£{Number(order.total).toFixed(2)}</td>
                            <td className="py-3 px-3">
                              <Badge variant="outline" className="text-xs">{order.status}</Badge>
                            </td>
                            <td className="py-3 px-3">
                              <Select
                                value={order.status}
                                onValueChange={(v) => updateOrderMutation.mutate({ id: order.id, status: v as "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded" })}
                              >
                                <SelectTrigger className="h-7 text-xs w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {["confirmed", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Service Bookings ({providerBookings?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {providerBookings && providerBookings.length > 0 ? (
                  <div className="space-y-3">
                    {providerBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30">
                        <div>
                          <p className="font-medium text-sm text-foreground">#{booking.bookingNumber}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.scheduledAt).toLocaleString()}
                          </p>
                          {booking.notes && <p className="text-xs text-muted-foreground mt-1 italic">"{booking.notes}"</p>}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">£{Number(booking.totalAmount).toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs mt-1">{booking.status}</Badge>
                          {booking.status === "pending" && (
                            <div className="flex gap-1 mt-2">
                              <Button size="sm" className="h-7 text-xs" onClick={() => updateBookingMutation.mutate({ id: booking.id, status: "confirmed" })}>
                                Confirm
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => updateBookingMutation.mutate({ id: booking.id, status: "cancelled" })}>
                                Decline
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No bookings yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <ShopSettings shop={shop} onSaved={() => refetchShop()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ShopSettings({ shop, onSaved }: { shop: { id: number; name: string; description?: string | null; location?: string | null; phone?: string | null; email?: string | null; website?: string | null; instagram?: string | null; facebook?: string | null; tiktok?: string | null; policies?: string | null }, onSaved: () => void }) {
  const [name, setName] = useState(shop.name);
  const [description, setDescription] = useState(shop.description ?? "");
  const [location, setLocation] = useState(shop.location ?? "");
  const [phone, setPhone] = useState(shop.phone ?? "");
  const [email, setEmail] = useState(shop.email ?? "");
  const [website, setWebsite] = useState(shop.website ?? "");
  const [instagram, setInstagram] = useState(shop.instagram ?? "");
  const [policies, setPolicies] = useState(shop.policies ?? "");

  const updateShopMutation = trpc.shops.update.useMutation({
    onSuccess: () => { toast.success("Shop settings saved!"); onSaved(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Shop Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Shop Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" className="mt-1" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Website</Label>
            <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" className="mt-1" />
          </div>
          <div>
            <Label>Instagram</Label>
            <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@handle" className="mt-1" />
          </div>
        </div>
        <div>
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1" />
        </div>
        <div>
          <Label>Shop Policies</Label>
          <Textarea value={policies} onChange={(e) => setPolicies(e.target.value)} rows={4} placeholder="Returns, shipping, custom orders..." className="mt-1" />
        </div>
        <Button
          onClick={() => updateShopMutation.mutate({ name, description, location, phone, email, website, instagram, policies })}
          disabled={updateShopMutation.isPending}
        >
          {updateShopMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
}
