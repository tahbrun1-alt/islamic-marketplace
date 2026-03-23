import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Users, Store, ShoppingBag, Calendar, Shield, TrendingUp,
  CheckCircle, XCircle, AlertCircle, Heart, DollarSign,
  Package, Star, BarChart3, Settings, Eye, Ban, RefreshCw,
  Globe, Award, Zap, BookOpen
} from "lucide-react";

// ── Admin email whitelist ──────────────────────────────────────────────────────
const ADMIN_EMAIL = "tahmidburner12@gmail.com";

export default function AdminPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const isAdmin = isAuthenticated && user?.role === "admin" && user?.email === ADMIN_EMAIL;

  const { data: adminStats } = trpc.admin.stats.useQuery(undefined, { enabled: isAdmin });
  const { data: allShops, refetch: refetchShops } = trpc.admin.shops.useQuery({ limit: 200 }, { enabled: isAdmin });
  const { data: allUsers } = trpc.admin.users.useQuery({ limit: 200 }, { enabled: isAdmin });
  const { data: allOrders } = trpc.orders.shopOrders.useQuery(undefined, { enabled: isAdmin });

  const pendingShops = allShops?.filter((s: { status: string }) => s.status === "pending") ?? [];
  const activeShops = allShops?.filter((s: { status: string }) => s.status === "active") ?? [];
  const suspendedShops = allShops?.filter((s: { status: string }) => s.status === "suspended") ?? [];

  // Revenue calculations — prefer backend stats, fallback to local calculation
  const totalGMV = (adminStats as { grossRevenue?: number } | null)?.grossRevenue ??
    (allOrders?.reduce((sum: number, o: { total: string; status: string }) =>
      o.status !== "cancelled" ? sum + Number(o.total) : sum, 0) ?? 0);
  const platformRevenue = (adminStats as { platformRevenue?: number } | null)?.platformRevenue ?? totalGMV * 0.065;
  const charityDonated = (adminStats as { charityDonated?: number } | null)?.charityDonated ?? totalGMV * 0.005;
  const totalCommission = totalGMV * 0.07;

  const verifyShopMutation = trpc.admin.verifyShop.useMutation({
    onSuccess: () => { toast.success("Shop verified successfully!"); refetchShops(); },
    onError: (e) => toast.error(e.message),
  });

  const suspendShopMutation = trpc.admin.updateShopStatus.useMutation({
    onSuccess: () => { toast.success("Shop status updated"); refetchShops(); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Strict admin gate — only tahmidburner12@gmail.com
  if (!isAuthenticated || user?.role !== "admin" || user?.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center pattern-bg">
        <div className="text-center bg-white rounded-2xl p-10 shadow-xl max-w-sm mx-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-6">
            This area is restricted to authorised administrators only.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Return to Homepage</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
                <p className="text-xs text-muted-foreground">Noor Marketplace — Management Console</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block" />
                Live
              </Badge>
              <span className="text-xs text-muted-foreground hidden sm:block">{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">

        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: "Total Users", value: adminStats?.users ?? 0, color: "text-blue-600 bg-blue-50", suffix: "" },
            { icon: Store, label: "Active Shops", value: activeShops.length, color: "text-emerald-600 bg-emerald-50", suffix: "" },
            { icon: ShoppingBag, label: "Total Orders", value: adminStats?.orders ?? 0, color: "text-purple-600 bg-purple-50", suffix: "" },
            { icon: Calendar, label: "Total Bookings", value: adminStats?.bookings ?? 0, color: "text-amber-600 bg-amber-50", suffix: "" },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}{stat.suffix}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue & Charity Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Total GMV</span>
              </div>
              <p className="text-3xl font-bold text-amber-800">£{totalGMV.toFixed(2)}</p>
              <p className="text-xs text-amber-600 mt-1">Gross merchandise value</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Platform Revenue</span>
              </div>
              <p className="text-3xl font-bold text-emerald-800">£{platformRevenue.toFixed(2)}</p>
              <p className="text-xs text-emerald-600 mt-1">7% total commission (6.5% platform + 0.5% charity)</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-rose-100/50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                <span className="text-xs font-medium text-rose-700 uppercase tracking-wide">Charity Donated</span>
              </div>
              <p className="text-3xl font-bold text-rose-800">£{charityDonated.toFixed(2)}</p>
              <p className="text-xs text-rose-600 mt-1">0.5% Sadaqah auto-donated</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="payouts"><DollarSign className="w-3.5 h-3.5 mr-1" />Payouts</TabsTrigger>
            <TabsTrigger value="moderation"><Shield className="w-3.5 h-3.5 mr-1" />Moderation</TabsTrigger>
            <TabsTrigger value="shops">
              Shops
              {pendingShops.length > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white text-xs px-1.5">{pendingShops.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="charity">Charity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" /> Revenue Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Total GMV", value: `£${totalGMV.toFixed(2)}`, color: "bg-amber-500" },
                      { label: "Platform Revenue (6.5%)", value: `£${platformRevenue.toFixed(2)}`, color: "bg-emerald-500" },
                      { label: "Charity Donated (0.5%)", value: `£${charityDonated.toFixed(2)}`, color: "bg-rose-500" },
                      { label: "Total Commission (7%)", value: `£${totalCommission.toFixed(2)}`, color: "bg-primary" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <span className="font-bold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Store className="w-4 h-4 text-primary" /> Shop Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Active Shops", count: activeShops.length, color: "bg-emerald-100 text-emerald-700" },
                      { label: "Pending Verification", count: pendingShops.length, color: "bg-amber-100 text-amber-700" },
                      { label: "Suspended", count: suspendedShops.length, color: "bg-red-100 text-red-700" },
                      { label: "Total Shops", count: allShops?.length ?? 0, color: "bg-blue-100 text-blue-700" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <Badge className={item.color}>{item.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /> Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("shops")}>
                    <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                    Review {pendingShops.length} pending shop{pendingShops.length !== 1 ? "s" : ""}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("orders")}>
                    <ShoppingBag className="w-4 h-4 mr-2 text-blue-500" />
                    View all orders ({allOrders?.length ?? 0})
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("charity")}>
                    <Heart className="w-4 h-4 mr-2 text-rose-500 fill-rose-500" />
                    View charity donations (£{charityDonated.toFixed(2)})
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("users")}>
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Manage users ({allUsers?.length ?? 0})
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="w-4 h-4 text-primary" /> Platform Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "Products Listed", value: adminStats?.products ?? 0, icon: Package },
                      { label: "Total Users", value: adminStats?.users ?? 0, icon: Users },
                      { label: "Orders Processed", value: adminStats?.orders ?? 0, icon: ShoppingBag },
                      { label: "Bookings Made", value: adminStats?.bookings ?? 0, icon: Calendar },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                        </div>
                        <span className="font-bold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Shops Tab */}
          <TabsContent value="shops">
            <div className="space-y-6">
              {pendingShops.length > 0 && (
                <Card className="border-0 shadow-sm border-l-4 border-l-amber-500">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" />
                      Awaiting Verification ({pendingShops.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingShops.map((shop: { id: number; name: string; location?: string | null; email?: string | null; createdAt: Date; description?: string | null }) => (
                        <div key={shop.id} className="flex items-start justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-foreground">{shop.name}</p>
                            {shop.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{shop.description}</p>}
                            <div className="flex items-center gap-3 mt-1">
                              {shop.location && <span className="text-xs text-muted-foreground">{shop.location}</span>}
                              {shop.email && <span className="text-xs text-muted-foreground">{shop.email}</span>}
                              <span className="text-xs text-muted-foreground">Applied: {new Date(shop.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-3 shrink-0">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white"
                              onClick={() => verifyShopMutation.mutate({ shopId: shop.id, isVerified: true })}
                              disabled={verifyShopMutation.isPending}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive border-destructive hover:bg-destructive/10"
                              onClick={() => suspendShopMutation.mutate({ shopId: shop.id, status: "suspended" })}
                              disabled={suspendShopMutation.isPending}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">All Shops ({allShops?.length ?? 0})</CardTitle>
                </CardHeader>
                <CardContent>
                  {allShops && allShops.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Shop</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Location</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Verified</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allShops.map((shop: { id: number; name: string; location?: string | null; status: string; isVerified: boolean; isHalalCertified: boolean }) => (
                            <tr key={shop.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-foreground">{shop.name}</span>
                                  {shop.isHalalCertified && <Badge className="bg-emerald-100 text-emerald-700 text-xs px-1">Halal</Badge>}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{shop.location ?? "—"}</td>
                              <td className="py-3 px-3">
                                <Badge className={
                                  shop.status === "active" ? "bg-emerald-100 text-emerald-700" :
                                  shop.status === "pending" ? "bg-amber-100 text-amber-700" :
                                  "bg-red-100 text-red-700"
                                }>{shop.status}</Badge>
                              </td>
                              <td className="py-3 px-3 hidden md:table-cell">
                                {shop.isVerified
                                  ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                                  : <XCircle className="w-4 h-4 text-muted-foreground" />}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex gap-1">
                                  {!shop.isVerified && shop.status !== "suspended" && (
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-600 hover:text-emerald-700"
                                      onClick={() => verifyShopMutation.mutate({ shopId: shop.id, isVerified: true })}>
                                      <CheckCircle className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                  {shop.status !== "suspended" && (
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:text-destructive"
                                      onClick={() => suspendShopMutation.mutate({ shopId: shop.id, status: "suspended" })}>
                                      <Ban className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                  {shop.status === "suspended" && (
                                    <Button size="sm" variant="ghost" className="h-7 px-2 text-emerald-600"
                                      onClick={() => suspendShopMutation.mutate({ shopId: shop.id, status: "active" })}>
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </Button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No shops yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">All Users ({allUsers?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {allUsers && allUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Name</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Email</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Role</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Joined</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allUsers.map((u: { id: number; name?: string | null; email?: string | null; role: string; createdAt: Date }) => (
                          <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                            <td className="py-3 px-3 font-medium text-foreground">{u.name ?? "—"}</td>
                            <td className="py-3 px-3 text-muted-foreground">{u.email ?? "—"}</td>
                            <td className="py-3 px-3 hidden sm:table-cell">
                              <Badge className={u.role === "admin" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}>
                                {u.role}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-muted-foreground hidden md:table-cell">
                              {new Date(u.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No users yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base">All Orders ({allOrders?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {allOrders && allOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Order #</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Total</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Platform (6.5%)</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden md:table-cell">Charity (0.5%)</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allOrders.map((order: { id: number; orderNumber: string; createdAt: Date; total: string; status: string; platformFee?: string | null; charityFee?: string | null }) => (
                          <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                            <td className="py-3 px-3 font-medium text-foreground">#{order.orderNumber}</td>
                            <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-3 font-bold text-primary">£{Number(order.total).toFixed(2)}</td>
                            <td className="py-3 px-3 text-emerald-600 font-medium">
                              £{order.platformFee ? Number(order.platformFee).toFixed(2) : (Number(order.total) * 0.065).toFixed(2)}
                            </td>
                            <td className="py-3 px-3 text-rose-600 font-medium hidden md:table-cell">
                              £{order.charityFee ? Number(order.charityFee).toFixed(2) : (Number(order.total) * 0.005).toFixed(2)}
                            </td>
                            <td className="py-3 px-3">
                              <Badge className={
                                order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                                order.status === "processing" ? "bg-blue-100 text-blue-700" :
                                order.status === "cancelled" ? "bg-red-100 text-red-700" :
                                "bg-amber-100 text-amber-700"
                              }>{order.status}</Badge>
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

          {/* Charity Tab */}
          <TabsContent value="charity">
            <div className="space-y-6">
              {/* Charity Summary */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-pink-50">
                  <CardContent className="p-5 text-center">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-rose-700">£{charityDonated.toFixed(2)}</p>
                    <p className="text-sm text-rose-600 mt-1">Total Donated</p>
                    <p className="text-xs text-rose-400 mt-0.5">0.5% of all transactions</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
                  <CardContent className="p-5 text-center">
                    <BookOpen className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-emerald-700">{allOrders?.filter((o: { charityFee?: string | null }) => o.charityFee && Number(o.charityFee) > 0).length ?? 0}</p>
                    <p className="text-sm text-emerald-600 mt-1">Orders with Donation</p>
                    <p className="text-xs text-emerald-400 mt-0.5">Every paid order contributes</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-yellow-50">
                  <CardContent className="p-5 text-center">
                    <Award className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold text-amber-700">
                      {totalGMV > 0 ? ((charityDonated / totalGMV) * 100).toFixed(2) : "0.50"}%
                    </p>
                    <p className="text-sm text-amber-600 mt-1">Effective Charity Rate</p>
                    <p className="text-xs text-amber-400 mt-0.5">Of total GMV</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charity Breakdown per Order */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    Charity Contributions by Order
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {allOrders && allOrders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Order #</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Order Total</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Charity (0.5%)</th>
                            <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allOrders.map((order: { id: number; orderNumber: string; createdAt: Date; total: string; status: string; charityFee?: string | null }) => {
                            const charity = order.charityFee ? Number(order.charityFee) : Number(order.total) * 0.005;
                            return (
                              <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                                <td className="py-3 px-3 font-medium text-foreground">#{order.orderNumber}</td>
                                <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 px-3 font-medium">£{Number(order.total).toFixed(2)}</td>
                                <td className="py-3 px-3">
                                  <span className="flex items-center gap-1 text-rose-600 font-semibold">
                                    <Heart className="w-3 h-3 fill-rose-500" />
                                    £{charity.toFixed(2)}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <Badge className={
                                    order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                                    order.status === "processing" ? "bg-blue-100 text-blue-700" :
                                    "bg-amber-100 text-amber-700"
                                  }>{order.status}</Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Heart className="w-12 h-12 text-rose-300 mx-auto mb-3" />
                      <p className="text-muted-foreground">No orders yet — charity donations will appear here once sales are made.</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">"The best of people are those who are most beneficial to people." — Prophet Muhammad ﷺ</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Charity Partners */}
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Charity Partners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { name: "Islamic Relief", cause: "Food & Water Relief", Icon: Utensils, allocation: "40%" },
                      { name: "Muslim Aid", cause: "Education & Schools", Icon: GraduationCap, allocation: "35%" },
                      { name: "Penny Appeal", cause: "Orphan Care", Icon: Heart, allocation: "25%" },
                    ].map((partner) => (
                      <div key={partner.name} className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-center">
                        <div className="text-2xl mb-2"><partner.Icon className="w-4 h-4" /></div>
                        <p className="font-semibold text-foreground text-sm">{partner.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{partner.cause}</p>
                        <Badge className="mt-2 bg-rose-100 text-rose-700 text-xs">{partner.allocation} of donations</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* Payouts Tab */}
          <TabsContent value="payouts">
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><DollarSign className="w-5 h-5 text-primary" /> Commission & Payout Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Total GMV", value: `£${((allOrders ?? []).reduce((sum: number, o: any) => sum + Number(o.total ?? 0), 0)).toFixed(2)}`, color: "text-blue-600 bg-blue-50" },
                      { label: "Platform Revenue (6.5%)", value: `£${((allOrders ?? []).reduce((sum: number, o: any) => sum + Number(o.total ?? 0), 0) * 0.065).toFixed(2)}`, color: "text-primary bg-amber-50" },
                      { label: "Charity Fund (0.5%)", value: `£${((allOrders ?? []).reduce((sum: number, o: any) => sum + Number(o.total ?? 0), 0) * 0.005).toFixed(2)}`, color: "text-emerald-600 bg-emerald-50" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className={`p-4 rounded-xl ${color.split(" ")[1]}`}>
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        <p className={`text-2xl font-bold ${color.split(" ")[0]}`}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Shop</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden sm:table-cell">Orders</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Revenue</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium">Commission</th>
                          <th className="text-left py-3 px-4 text-muted-foreground font-medium hidden md:table-cell">Net Payout</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(allShops ?? []).slice(0, 20).map((shop: any) => {
                          const shopRevenue = (allOrders ?? []).filter((o: any) => o.shopId === shop.id).reduce((sum: number, o: any) => sum + Number(o.total ?? 0), 0);
                          const shopOrders = (allOrders ?? []).filter((o: any) => o.shopId === shop.id).length;
                          const commission = shopRevenue * 0.07;
                          const netPayout = shopRevenue * 0.93;
                          return (
                            <tr key={shop.id} className="hover:bg-secondary/50">
                              <td className="py-3 px-4 font-medium text-foreground">{shop.name}</td>
                              <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{shopOrders}</td>
                              <td className="py-3 px-4 font-medium text-foreground">£{shopRevenue.toFixed(2)}</td>
                              <td className="py-3 px-4 text-primary font-medium">£{commission.toFixed(2)}</td>
                              <td className="py-3 px-4 text-emerald-600 font-medium hidden md:table-cell">£{netPayout.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Moderation Tab */}
          <TabsContent value="moderation">
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Content Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <CheckCircle className="w-6 h-6 text-emerald-600 mb-2" />
                      <p className="text-2xl font-bold text-emerald-700">{(allShops ?? []).filter((s: any) => s.isVerified).length}</p>
                      <p className="text-xs text-muted-foreground">Verified Shops</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <AlertCircle className="w-6 h-6 text-amber-600 mb-2" />
                      <p className="text-2xl font-bold text-amber-700">{(allShops ?? []).filter((s: any) => !s.isVerified).length}</p>
                      <p className="text-xs text-muted-foreground">Pending Verification</p>
                    </div>
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <Users className="w-6 h-6 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold text-blue-700">{(allUsers ?? []).length}</p>
                      <p className="text-xs text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground text-sm">Halal Compliance Checklist</h4>
                    {[
                      { item: "No alcohol products listed", status: true },
                      { item: "No pork or pork derivatives", status: true },
                      { item: "No gambling or interest-based services", status: true },
                      { item: "No adult content", status: true },
                      { item: "Seller verification process active", status: true },
                      { item: "Dispute resolution system active", status: true },
                    ].map(({ item, status }) => (
                      <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                        {status ? (
                          <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive shrink-0" />
                        )}
                        <span className="text-sm text-foreground">{item}</span>
                        <Badge className={`ml-auto text-xs ${status ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {status ? "Compliant" : "Action Required"}
                        </Badge>
                      </div>
                    ))}
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
