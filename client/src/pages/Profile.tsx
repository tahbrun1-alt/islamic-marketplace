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
import { toast } from "sonner";
import { User, Package, Calendar, Store, Shield, Mail, Phone } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => { toast.success("Profile updated!"); setIsSaving(false); },
    onError: (e) => { toast.error(e.message); setIsSaving(false); },
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Sign in to view your profile</h2>
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

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">My Account</h1>

        {/* Profile Card */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold text-foreground">{user?.name ?? "User"}</h2>
                <p className="text-muted-foreground text-sm">{user?.email}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">{user?.loginMethod ?? "Manus"}</Badge>
                  {user?.role === "admin" && <Badge className="bg-primary text-primary-foreground text-xs">Admin</Badge>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="border-0 shadow-sm mb-6">
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
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { icon: Package, label: "My Orders", href: "/orders" },
              { icon: Calendar, label: "My Bookings", href: "/bookings" },
              { icon: Store, label: "Seller Dashboard", href: "/seller/dashboard" },
              ...(user?.role === "admin" ? [{ icon: Shield, label: "Admin Panel", href: "/admin" }] : []),
            ].map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors">
                <item.icon className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">{item.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
