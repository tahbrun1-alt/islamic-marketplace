import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User, Package, Calendar, Store, Shield, Heart,
  MessageSquare, Settings, ShoppingBag, Clock, MapPin,
  Star, ChevronRight, Bell
} from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const { data: orders } = trpc.orders.myOrders.useQuery(undefined, { enabled: isAuthenticated });
  const { data: bookings } = trpc.bookings.myBookings.useQuery(undefined, { enabled: isAuthenticated });
  const { data: wishlist } = trpc.wishlist.list.useQuery(undefined, { enabled: isAuthenticated });
  const { data: conversations } = trpc.messages.conversations.useQuery(undefined, { enabled: isAuthenticated });

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => { toast.success("Profile updated!"); setIsSaving(false); },
    onError: (e) => { toast.error(e.message); setIsSaving(false); },
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pattern-bg">
        <div className="text-center bg-card rounded-2xl p-10 shadow-xl max-w-sm mx-4 border border-border">
          <User className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Sign in to view your account</h2>
          <p className="text-muted-foreground text-sm mb-6">Access your orders, bookings, wishlist and more.</p>
          <Button asChild><a href={getLoginUrl()}>Sign In</a></Button>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    updateProfileMutation.mutate({ name: name || undefined });
  };

  const recentOrders = (orders ?? []).slice(0, 5);
  const recentBookings = (bookings ?? []).slice(0, 5);

  return (
    <div className="min-h-screen bg-secondary/20 py-8">
      <div className="container max-w-4xl">

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 p-6 bg-card rounded-2xl border border-border shadow-sm">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{user?.name ?? "User"}</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-xs">Member</Badge>
              {user?.role === "admin" && <Badge className="bg-primary text-primary-foreground text-xs">Admin</Badge>}
            </div>
          </div>
          <div className="hidden sm:grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-foreground">{orders?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{bookings?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Bookings</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{wishlist?.length ?? 0}</p>
              <p className="text-xs text-muted-foreground">Saved</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders"><Package className="w-3.5 h-3.5 mr-1" />Orders</TabsTrigger>
            <TabsTrigger value="bookings"><Calendar className="w-3.5 h-3.5 mr-1" />Bookings</TabsTrigger>
            <TabsTrigger value="wishlist"><Heart className="w-3.5 h-3.5 mr-1" />Wishlist</TabsTrigger>
            <TabsTrigger value="messages"><MessageSquare className="w-3.5 h-3.5 mr-1" />Messages</TabsTrigger>
            <TabsTrigger value="settings"><Settings className="w-3.5 h-3.5 mr-1" />Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { icon: ShoppingBag, label: "Total Orders", value: orders?.length ?? 0, href: "/orders", color: "text-blue-600 bg-blue-50" },
                { icon: Calendar, label: "Bookings", value: bookings?.length ?? 0, href: "/bookings", color: "text-purple-600 bg-purple-50" },
                { icon: Heart, label: "Wishlist", value: wishlist?.length ?? 0, href: "/wishlist", color: "text-rose-600 bg-rose-50" },
                { icon: MessageSquare, label: "Messages", value: conversations?.length ?? 0, href: "/messages", color: "text-emerald-600 bg-emerald-50" },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <Link key={label} href={href}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Recent Orders</CardTitle>
                  <Link href="/orders" className="text-xs text-primary hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.map((order: any) => (
                        <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-medium text-foreground">#{order.orderNumber}</p>
                            <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">£{Number(order.total).toFixed(2)}</p>
                            <Badge variant="outline" className="text-xs capitalize">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No orders yet</p>
                      <Button asChild variant="outline" size="sm" className="mt-3">
                        <Link href="/products">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Bookings */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Recent Bookings</CardTitle>
                  <Link href="/bookings" className="text-xs text-primary hover:underline flex items-center gap-1">
                    View all <ChevronRight className="w-3 h-3" />
                  </Link>
                </CardHeader>
                <CardContent>
                  {recentBookings.length > 0 ? (
                    <div className="space-y-3">
                      {recentBookings.map((booking: any) => (
                        <div key={booking.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div>
                            <p className="text-sm font-medium text-foreground">#{booking.bookingNumber}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(booking.scheduledAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">£{Number(booking.totalAmount).toFixed(2)}</p>
                            <Badge variant="outline" className="text-xs capitalize">{booking.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No bookings yet</p>
                      <Button asChild variant="outline" size="sm" className="mt-3">
                        <Link href="/services">Browse Services</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <Card className="border-0 shadow-sm mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { icon: Store, label: "Seller Dashboard", desc: "Manage your shop", href: "/seller/dashboard" },
                  { icon: Bell, label: "Notifications", desc: "View all alerts", href: "/notifications" },
                  { icon: Heart, label: "Wishlist", desc: "Saved items", href: "/wishlist" },
                  { icon: MessageSquare, label: "Messages", desc: "Chat with sellers", href: "/messages" },
                  ...(user?.role === "admin" ? [{ icon: Shield, label: "Admin Panel", desc: "Manage platform", href: "/admin" }] : []),
                ].map((item) => (
                  <Link key={item.href} href={item.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors border border-border/50">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </Link>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>My Orders ({orders?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {(orders ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(orders ?? []).map((order: any) => (
                      <div key={order.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30">
                        <div>
                          <p className="font-medium text-sm text-foreground">Order #{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{order.items?.length ?? 0} item(s)</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">£{Number(order.total).toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs capitalize mt-1">{order.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">You haven't placed any orders yet</p>
                    <Button asChild>
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>My Bookings ({bookings?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {(bookings ?? []).length > 0 ? (
                  <div className="space-y-3">
                    {(bookings ?? []).map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-secondary/30">
                        <div>
                          <p className="font-medium text-sm text-foreground">#{booking.bookingNumber}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(booking.scheduledAt).toLocaleString()}
                          </p>
                          {booking.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">"{booking.notes}"</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">£{Number(booking.totalAmount).toFixed(2)}</p>
                          <Badge variant="outline" className="text-xs capitalize mt-1">{booking.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">No bookings yet</p>
                    <Button asChild>
                      <Link href="/services">Browse Services</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle>My Wishlist ({wishlist?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                {(wishlist ?? []).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(wishlist ?? []).map((item: any) => (
                      <Link
                        key={item.id}
                        href={item.product ? `/products/${item.product.id}` : `/services/${item.service?.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-secondary transition-colors"
                      >
                        <div className="w-14 h-14 rounded-lg bg-secondary overflow-hidden shrink-0">
                          {(item.product?.images?.[0] || item.service?.images?.[0]) ? (
                            <img
                              src={item.product?.images?.[0] ?? item.service?.images?.[0]}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">
                              {item.product ? "shopping" : "settings"}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {item.product?.title ?? item.service?.title}
                          </p>
                          <p className="text-sm font-bold text-primary mt-0.5">
                            £{Number(item.product?.price ?? item.service?.price ?? 0).toFixed(2)}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Your wishlist is empty</p>
                    <div className="flex gap-2 justify-center">
                      <Button asChild variant="outline">
                        <Link href="/products">Browse Products</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/services">Browse Services</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Your Messages</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {(conversations?.length ?? 0) > 0
                    ? `You have ${conversations?.length} active conversation(s).`
                    : "No messages yet. Start by messaging a seller from any listing."}
                </p>
                <Button asChild>
                  <Link href="/messages">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Open Messages
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <Label>Display Name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="Your name" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={user?.email ?? ""} disabled className="mt-1 bg-secondary/50" />
                      <p className="text-xs text-muted-foreground mt-1">Email is managed through your sign-in provider</p>
                    </div>
                    <Button type="submit" disabled={isSaving}
                      style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }}
                      className="text-primary-foreground"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Member since</span>
                    <span className="text-sm font-medium text-foreground">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "2026"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Account type</span>
                    <Badge variant="outline" className="text-xs capitalize">{user?.role ?? "buyer"}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">Sign-in method</span>
                    <Badge variant="outline" className="text-xs capitalize">{user?.loginMethod ?? "email"}</Badge>
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
