import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Link } from "wouter";
import { Users, Store, ShoppingBag, Calendar, Shield, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AdminPanel() {
  const { user, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: adminStats } = trpc.admin.stats.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const { data: pendingShops, refetch: refetchShops } = trpc.admin.shops.useQuery({ limit: 100 }, { enabled: isAuthenticated && user?.role === "admin", select: (shops) => shops.filter((s: { status: string }) => s.status === "pending") });
  const { data: allOrders } = trpc.orders.shopOrders.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  const verifyShopMutation = trpc.admin.verifyShop.useMutation({
    onSuccess: () => { toast.success("Shop verified!"); refetchShops(); },
    onError: (e) => toast.error(e.message),
  });

  const suspendShopMutation = trpc.admin.verifyShop.useMutation({
    onSuccess: () => { toast.success("Shop suspended"); refetchShops(); },
    onError: (e: { message: string }) => toast.error(e.message),
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Access Denied</h2>
          <p className="text-muted-foreground">Admin access required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="bg-white border-b border-border">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Noor Marketplace Management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Users, label: "Total Users", value: adminStats?.users ?? 0, color: "text-blue-600 bg-blue-50" },
            { icon: Store, label: "Active Shops", value: adminStats?.shops ?? 0, color: "text-emerald-600 bg-emerald-50" },
            { icon: ShoppingBag, label: "Total Orders", value: adminStats?.orders ?? 0, color: "text-purple-600 bg-purple-50" },
            { icon: Calendar, label: "Total Bookings", value: adminStats?.bookings ?? 0, color: "text-amber-600 bg-amber-50" },
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="shops">
              Shops
              {pendingShops && pendingShops.length > 0 && (
                <Badge className="ml-2 bg-amber-500 text-white text-xs">{pendingShops.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-base">Platform Revenue</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total GMV</span>
                      <span className="font-bold text-foreground">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Platform Revenue (6.5%)</span>
                      <span className="font-bold text-primary">—</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Pending Verification</span>
                      <Badge className="bg-amber-100 text-amber-700">{pendingShops?.length ?? 0} shops</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader><CardTitle className="text-base">Quick Actions</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("shops")}>
                    <AlertCircle className="w-4 h-4 mr-2 text-amber-500" />
                    Review {pendingShops?.length ?? 0} pending shops
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab("orders")}>
                    <ShoppingBag className="w-4 h-4 mr-2 text-blue-500" />
                    View all orders
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shops">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Shops Awaiting Verification ({pendingShops?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingShops && pendingShops.length > 0 ? (
                  <div className="space-y-3">
                    {pendingShops.map((shop: { id: number; name: string; location?: string | null; createdAt: Date }) => (
                      <div key={shop.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30">
                        <div>
                          <p className="font-medium text-foreground">{shop.name}</p>
                          <p className="text-xs text-muted-foreground">{shop.location ?? "No location"}</p>
                          <p className="text-xs text-muted-foreground">Created: {new Date(shop.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-emerald-500 hover:bg-emerald-600 text-white"
                            onClick={() => verifyShopMutation.mutate({ shopId: shop.id, isVerified: true })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive border-destructive hover:bg-destructive/10"
                            onClick={() => suspendShopMutation.mutate({ shopId: shop.id, isVerified: false })}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Suspend
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                    <p className="text-muted-foreground">All shops are verified!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle>All Orders ({allOrders?.length ?? 0})</CardTitle></CardHeader>
              <CardContent>
                {allOrders && allOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Order #</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Date</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Total</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Commission</th>
                          <th className="text-left py-2 px-3 text-muted-foreground font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allOrders.map((order: { id: number; orderNumber: string; createdAt: Date; total: string; status: string }) => (
                          <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                            <td className="py-3 px-3 font-medium text-foreground">#{order.orderNumber}</td>
                            <td className="py-3 px-3 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="py-3 px-3 font-bold text-primary">£{Number(order.total).toFixed(2)}</td>
                            <td className="py-3 px-3 text-emerald-600 font-medium">£{(Number(order.total) * 0.065).toFixed(2)}</td>
                            <td className="py-3 px-3">
                              <Badge variant="outline" className="text-xs">{order.status}</Badge>
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
        </Tabs>
      </div>
    </div>
  );
}
