import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Bell, ShoppingBag, Store, Star, MessageSquare,
  Package, CheckCircle, AlertCircle, Info, Heart
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  order: ShoppingBag,
  shop: Store,
  review: Star,
  message: MessageSquare,
  product: Package,
  success: CheckCircle,
  warning: AlertCircle,
  info: Info,
  charity: Heart,
};

export default function Notifications() {
  const { isAuthenticated, loading } = useAuth();
  const { data: notifications, refetch } = trpc.notifications.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const markReadMutation = trpc.notifications.markRead.useMutation({
    onSuccess: () => refetch(),
  });

  useEffect(() => {
    if (isAuthenticated && notifications?.some((n: { isRead: boolean }) => !n.isRead)) {
      const timer = setTimeout(() => {
        markReadMutation.mutate();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, notifications]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center pattern-bg">
        <div className="text-center bg-white rounded-2xl p-10 shadow-xl max-w-sm mx-4">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Sign In Required</h2>
          <p className="text-muted-foreground text-sm mb-6">Please sign in to view your notifications.</p>
          <Button asChild><Link href="/login">Sign In</Link></Button>
        </div>
      </div>
    );
  }

  const unreadCount = notifications?.filter((n: { isRead: boolean }) => !n.isRead).length ?? 0;

  return (
    <div className="min-h-screen bg-secondary/30">
      <div className="container py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-primary text-primary-foreground ml-1">{unreadCount} new</Badge>
              )}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Stay up to date with your orders, messages, and more.</p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={() => markReadMutation.mutate()} disabled={markReadMutation.isPending}>
              <CheckCircle className="w-4 h-4 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        {notifications && notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notif: {
              id: number;
              type: string;
              title: string;
              message: string;
              isRead: boolean;
              link?: string | null;
              createdAt: Date;
            }, i: number) => {
              const IconComponent = iconMap[notif.type] ?? Bell;
              const isUnread = !notif.isRead;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card className={`border-0 shadow-sm transition-all ${isUnread ? "bg-primary/5 border-l-4 border-l-primary" : "bg-white"}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          notif.type === "order" ? "bg-blue-100 text-blue-600" :
                          notif.type === "review" ? "bg-amber-100 text-amber-600" :
                          notif.type === "message" ? "bg-purple-100 text-purple-600" :
                          notif.type === "charity" ? "bg-rose-100 text-rose-600" :
                          "bg-primary/10 text-primary"
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm font-medium ${isUnread ? "text-foreground" : "text-foreground/80"}`}>
                              {notif.title}
                            </p>
                            {isUnread && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{notif.message}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(notif.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric", month: "short", year: "numeric",
                                hour: "2-digit", minute: "2-digit"
                              })}
                            </span>
                            {notif.link && (
                              <Button variant="ghost" size="sm" asChild className="h-6 px-2 text-xs text-primary">
                                <Link href={notif.link}>View →</Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">All caught up!</h3>
            <p className="text-muted-foreground text-sm">You have no notifications right now. We'll let you know when something happens.</p>
            <Button asChild className="mt-6" variant="outline">
              <Link href="/">Browse Marketplace</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
