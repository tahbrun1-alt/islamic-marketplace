import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { MessageSquare, Send, ArrowLeft, Search, Package, Calendar, User } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

type Conversation = {
  id: number;
  otherUser: { id: number; name: string; avatar?: string | null };
  lastMessage?: { body: string; createdAt: string; senderId: number } | null;
  product?: { id: number; title: string; images: unknown } | null;
  service?: { id: number; title: string; images: unknown } | null;
  unreadCount?: number;
};

type Message = {
  id: number;
  body: string;
  senderId: number;
  createdAt: string;
};

export default function Messages() {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  const { data: conversations, isLoading: convsLoading } = trpc.messages.conversations.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchInterval: 10000,
  });

  const { data: messages, isLoading: msgsLoading } = trpc.messages.getMessages.useQuery(
    { conversationId: selectedConvId! },
    { enabled: !!selectedConvId, refetchInterval: 5000 }
  );

  const sendMutation = trpc.messages.send.useMutation({
    onSuccess: () => {
      setMessageText("");
      utils.messages.getMessages.invalidate({ conversationId: selectedConvId! });
      utils.messages.conversations.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const selectedConv = (conversations as Conversation[] | undefined)?.find((c: Conversation) => c.id === selectedConvId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConv) return;
    sendMutation.mutate({
      recipientId: selectedConv.otherUser.id,
      body: messageText.trim(),
    });
  };

  const handleSelectConv = (conv: Conversation) => {
    setSelectedConvId(conv.id);
    setShowMobileChat(true);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { day: "numeric", month: "short" });
  };

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
        <div className="text-center bg-card rounded-2xl p-10 shadow-xl max-w-sm mx-4 border border-border">
          <MessageSquare className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Sign in to view messages</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Connect with sellers and buyers through our secure messaging system.
          </p>
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const filteredConvs = ((conversations ?? []) as unknown as Conversation[]).filter((c: Conversation) =>
    !searchQuery || c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="container py-6 max-w-5xl">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm" style={{ height: "calc(100vh - 140px)", minHeight: "500px" }}>
          <div className="flex h-full">

            {/* ── Conversations Sidebar ── */}
            <div className={`w-full md:w-80 border-r border-border flex flex-col ${showMobileChat ? "hidden md:flex" : "flex"}`}>
              {/* Header */}
              <div className="p-4 border-b border-border">
                <h1 className="font-semibold text-foreground text-lg mb-3">Messages</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9 text-sm"
                  />
                </div>
              </div>

              {/* Conversation List */}
              <div className="flex-1 overflow-y-auto">
                {convsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                  </div>
                ) : filteredConvs.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">No conversations yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Message a seller from any product or service listing
                    </p>
                    <Button asChild variant="outline" size="sm" className="mt-4">
                      <Link href="/products">Browse Products</Link>
                    </Button>
                  </div>
                ) : (
                    (filteredConvs as Conversation[]).map((conv: Conversation) => (
                    <button
                      key={conv.id}
                      onClick={() => handleSelectConv(conv)}
                      className={`w-full flex items-start gap-3 p-4 hover:bg-secondary/60 transition-colors text-left border-b border-border/50 ${
                        selectedConvId === conv.id ? "bg-secondary" : ""
                      }`}
                    >
                      <Avatar className="w-10 h-10 shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {conv.otherUser.name?.[0]?.toUpperCase() ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="font-medium text-sm text-foreground truncate">{conv.otherUser.name}</span>
                          {conv.lastMessage && (
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">
                              {formatTime(conv.lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        {(conv.product || conv.service) && (
                          <div className="flex items-center gap-1 mb-0.5">
                            {conv.product ? (
                              <Package className="w-3 h-3 text-muted-foreground" />
                            ) : (
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                            )}
                            <span className="text-xs text-muted-foreground truncate">
                              {conv.product?.title ?? conv.service?.title}
                            </span>
                          </div>
                        )}
                        {conv.lastMessage && (
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage.senderId === user?.id ? "You: " : ""}
                            {conv.lastMessage.body}
                          </p>
                        )}
                      </div>
                      {(conv.unreadCount ?? 0) > 0 && (
                        <Badge className="shrink-0 h-5 min-w-5 text-xs">{conv.unreadCount}</Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* ── Chat Panel ── */}
            <div className={`flex-1 flex flex-col ${!showMobileChat ? "hidden md:flex" : "flex"}`}>
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setShowMobileChat(false)}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                        {selectedConv.otherUser.name?.[0]?.toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{selectedConv.otherUser.name}</p>
                      {(selectedConv.product || selectedConv.service) && (
                        <p className="text-xs text-muted-foreground truncate">
                          Re: {selectedConv.product?.title ?? selectedConv.service?.title}
                        </p>
                      )}
                    </div>
                    {selectedConv.product && (
                      <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                        <Link href={`/products/${selectedConv.product.id}`}>
                          <Package className="w-3.5 h-3.5 mr-1.5" />
                          View Product
                        </Link>
                      </Button>
                    )}
                    {selectedConv.service && (
                      <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                        <Link href={`/services/${selectedConv.service.id}`}>
                          <Calendar className="w-3.5 h-3.5 mr-1.5" />
                          View Service
                        </Link>
                      </Button>
                    )}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {msgsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full" />
                      </div>
                    ) : (messages ?? []).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No messages yet. Say السلام عليكم!</p>
                      </div>
                    ) : (
                      ((messages ?? []) as unknown as Message[]).map((msg: Message) => {
                        const isOwn = msg.senderId === user?.id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                          >
                            <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                              isOwn
                                ? "text-primary-foreground rounded-br-sm"
                                : "bg-secondary text-foreground rounded-bl-sm"
                            }`}
                              style={isOwn ? { background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" } : {}}
                            >
                              <p>{msg.body}</p>
                              <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-border">
                    <form onSubmit={handleSend} className="flex gap-2">
                      <Input
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1"
                        maxLength={5000}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        disabled={!messageText.trim() || sendMutation.isPending}
                        style={{ background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))" }}
                        className="text-primary-foreground"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Be respectful and conduct all transactions through Noor Marketplace for buyer protection.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Your Messages</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Select a conversation to start chatting, or message a seller from any listing.
                    </p>
                    <div className="flex gap-2 justify-center mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link href="/products">Browse Products</Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/services">Browse Services</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
