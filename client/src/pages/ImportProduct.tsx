import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link2, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

export default function ImportProduct() {
  const [, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [url, setUrl] = useState("");
  const [imported, setImported] = useState<{
    title: string;
    description: string;
    price: number | null;
    currency: string;
    images: string[];
    sourceUrl: string;
  } | null>(null);

  const importMutation = trpc.importer.importFromUrl.useMutation({
    onSuccess: (data) => {
      setImported(data);
      toast.success("Product data extracted successfully!");
    },
    onError: (e) => {
      toast.error(e.message || "Failed to import product. Please try a different URL.");
    },
  });

  const handleImport = () => {
    if (!url.trim()) return;
    try {
      new URL(url);
    } catch {
      toast.error("Please enter a valid URL (e.g. https://example.com/product)");
      return;
    }
    importMutation.mutate({ url: url.trim() });
  };

  const handleCreateProduct = () => {
    if (!imported) return;
    // Pass the imported data to the product form via query params
    const params = new URLSearchParams({
      title: imported.title,
      description: imported.description,
      price: imported.price?.toString() ?? "",
      images: JSON.stringify(imported.images),
    });
    navigate(`/seller/products/new?${params.toString()}`);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 text-foreground">Sign in to use the Product Importer</h2>
          <Button asChild><a href="/login">Sign In</a></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Product Importer
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Import Products from Any Website
          </h1>
          <p className="text-muted-foreground">
            Paste a product URL and our AI will automatically extract the title, description, price, and images.
          </p>
        </div>

        {/* URL Input */}
        <Card className="border-0 shadow-sm mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" /> Product URL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://www.etsy.com/listing/... or any product page URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleImport()}
                  className="text-sm"
                />
              </div>
              <Button
                onClick={handleImport}
                disabled={!url.trim() || importMutation.isPending}
                className="btn-gold shrink-0"
              >
                {importMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Import
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Works with Etsy, Amazon, eBay, Shopify stores, and most product pages.
            </p>
          </CardContent>
        </Card>

        {/* Loading state */}
        {importMutation.isPending && (
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="p-8 text-center">
              <Loader2 className="w-10 h-10 text-primary mx-auto mb-3 animate-spin" />
              <p className="font-medium text-foreground">Fetching and analysing product page...</p>
              <p className="text-sm text-muted-foreground mt-1">This may take a few seconds</p>
            </CardContent>
          </Card>
        )}

        {/* Error state */}
        {importMutation.isError && (
          <Card className="border-0 shadow-sm mb-6 border-l-4 border-l-red-400">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Import failed</p>
                <p className="text-sm text-muted-foreground">{importMutation.error.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Some websites block automated access. Try copying the product details manually.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Extracted product data */}
        {imported && (
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Extracted Product Data
                <a
                  href={imported.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                >
                  View source <ExternalLink className="w-3 h-3" />
                </a>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Images */}
              {imported.images.length > 0 && (
                <div>
                  <Label className="text-xs text-muted-foreground mb-2 block">Images ({imported.images.length} found)</Label>
                  <div className="flex gap-2 flex-wrap">
                    {imported.images.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border border-border bg-secondary">
                        <img
                          src={img}
                          alt={`Product image ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Title</Label>
                <Input
                  value={imported.title}
                  onChange={(e) => setImported({ ...imported, title: e.target.value })}
                  className="font-medium"
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-xs text-muted-foreground mb-1 block">Description</Label>
                <Textarea
                  value={imported.description}
                  onChange={(e) => setImported({ ...imported, description: e.target.value })}
                  rows={4}
                  className="text-sm resize-none"
                />
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={imported.price ?? ""}
                    onChange={(e) => setImported({ ...imported, price: e.target.value ? Number(e.target.value) : null })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground mb-1 block">Currency</Label>
                  <Input
                    value={imported.currency}
                    onChange={(e) => setImported({ ...imported, currency: e.target.value.toUpperCase() })}
                    maxLength={3}
                    className="uppercase"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2 border-t border-border">
                <Button
                  onClick={handleCreateProduct}
                  className="btn-gold flex-1"
                >
                  Create Product Listing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { setImported(null); setUrl(""); }}
                >
                  Import Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        {!imported && !importMutation.isPending && (
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {[
              { icon: "🔗", title: "Any Product URL", desc: "Works with most e-commerce sites including Etsy, Amazon, eBay, and Shopify stores" },
              { icon: "🤖", title: "AI Extraction", desc: "Our AI reads the page and intelligently extracts product title, description, price, and images" },
              { icon: "✏️", title: "Review & Edit", desc: "Review the extracted data, make any adjustments, then publish to your Noor shop" },
            ].map((tip) => (
              <Card key={tip.title} className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{tip.icon}</div>
                  <p className="font-medium text-sm text-foreground mb-1">{tip.title}</p>
                  <p className="text-xs text-muted-foreground">{tip.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
