import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  ArrowLeft, Save, Package, Image as ImageIcon, Tag, DollarSign,
  Hash, ToggleLeft, Loader2, Plus, X, AlertCircle
} from "lucide-react";

const CATEGORIES = [
  { id: 1, name: "Clothing & Modest Fashion" },
  { id: 2, name: "Books & Education" },
  { id: 3, name: "Food & Halal Groceries" },
  { id: 4, name: "Home & Decor" },
  { id: 5, name: "Jewellery & Accessories" },
  { id: 6, name: "Kids & Toys" },
  { id: 7, name: "Health & Beauty" },
  { id: 8, name: "Art & Calligraphy" },
];

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  comparePrice: string;
  type: "physical" | "digital";
  inventory: string;
  categoryId: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isHalalCertified: boolean;
  gender: "all" | "male" | "female" | "children";
  images: string[];
}

const defaultForm: ProductFormData = {
  title: "",
  description: "",
  price: "",
  comparePrice: "",
  type: "physical",
  inventory: "1",
  categoryId: "",
  tags: [],
  isActive: true,
  isFeatured: false,
  isHalalCertified: false,
  gender: "all",
  images: [],
};

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const isEdit = !!id && id !== "new";

  const [form, setForm] = useState<ProductFormData>(defaultForm);
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});

  // Fetch existing product if editing
  const { data: product, isLoading: productLoading } = trpc.products.getById.useQuery(
    { id: parseInt(id!) },
    { enabled: isEdit && !!id }
  );

  // Fetch seller's shop
  const { data: shop } = trpc.shops.myShop.useQuery(undefined, { enabled: isAuthenticated });

  const createMutation = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully!");
      navigate("/seller/dashboard");
    },
    onError: (err) => toast.error(err.message || "Failed to create product"),
  });

  const updateMutation = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully!");
      navigate("/seller/dashboard");
    },
    onError: (err) => toast.error(err.message || "Failed to update product"),
  });

  // Populate form when editing
  useEffect(() => {
    if (product && isEdit) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        comparePrice: product.comparePrice?.toString() || "",
        type: (product.type as "physical" | "digital") || "physical",
        inventory: product.inventory?.toString() || "1",
        categoryId: product.categoryId?.toString() || "",
        tags: (product.tags as string[]) || [],
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        isHalalCertified: (product as any).isHalalCertified ?? false,
        gender: ((product as any).gender as "all" | "male" | "female" | "children") || "all",
        images: (product.images as string[]) || [],
      });
    }
  }, [product, isEdit]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "Product name is required";
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "Valid price is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : undefined,
      type: form.type,
      inventory: parseInt(form.inventory) || 0,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      tags: form.tags,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      gender: form.gender,
      images: form.images,
    };

    if (isEdit) {
      updateMutation.mutate({ id: parseInt(id!), ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      setForm((f) => ({ ...f, tags: [...f.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm((f) => ({ ...f, tags: f.tags.filter((t) => t !== tag) }));
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (url && !form.images.includes(url)) {
      setForm((f) => ({ ...f, images: [...f.images, url] }));
    }
    setImageInput("");
  };

  const removeImage = (url: string) => {
    setForm((f) => ({ ...f, images: f.images.filter((i) => i !== url) }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Please sign in to manage products.</p>
        </div>
      </div>
    );
  }

  if (isEdit && productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEdit && !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground">Product not found or you don't have permission to edit it.</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate("/seller/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/seller/dashboard")}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit ? `Editing: ${product?.title}` : "Create a new listing for your shop"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Basic Information</h2>
            </div>

            <div>
              <Label htmlFor="title">Product Name *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Hand-Embroidered Abaya"
                className={`mt-1 ${errors.title ? "border-destructive" : ""}`}
              />
              {errors.title && <p className="text-xs text-destructive mt-1">{errors.title}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe your product in detail — materials, dimensions, care instructions..."
                rows={5}
                className={`mt-1 ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Product Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm((f) => ({ ...f, type: v as "physical" | "digital" }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physical">Physical Product</SelectItem>
                  <SelectItem value="digital">Digital Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gender">Target Audience</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => setForm((f) => ({ ...f, gender: v as typeof form.gender }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Everyone</SelectItem>
                  <SelectItem value="male">Men</SelectItem>
                  <SelectItem value="female">Women</SelectItem>
                  <SelectItem value="children">Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Pricing & Inventory</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (£) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="0.00"
                  className={`mt-1 ${errors.price ? "border-destructive" : ""}`}
                />
                {errors.price && <p className="text-xs text-destructive mt-1">{errors.price}</p>}
              </div>
              <div>
                <Label htmlFor="comparePrice">Compare-at Price (£)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.comparePrice}
                  onChange={(e) => setForm((f) => ({ ...f, comparePrice: e.target.value }))}
                  placeholder="Original price (optional)"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">Shows a strikethrough "was" price</p>
              </div>
            </div>

            {form.type === "physical" && (
              <div>
                <Label htmlFor="inventory">Stock Quantity</Label>
                <Input
                  id="inventory"
                  type="number"
                  min="0"
                  value={form.inventory}
                  onChange={(e) => setForm((f) => ({ ...f, inventory: e.target.value }))}
                  className="mt-1 w-32"
                />
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <ImageIcon className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Product Images</h2>
            </div>

            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste image URL (https://...)"
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
              />
              <Button type="button" variant="outline" onClick={addImage} disabled={!imageInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border">
                    <img
                      src={url}
                      alt={`Product image ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {i === 0 && (
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        Main
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Add image URLs for your product. The first image will be the main display image.
            </p>
          </div>

          {/* Tags */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Tags</h2>
            </div>

            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag (e.g. abaya, modest, eid)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); addTag(); }
                  if (e.key === ",") { e.preventDefault(); addTag(); }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <ToggleLeft className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Listing Settings</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Active listing</p>
                  <p className="text-xs text-muted-foreground">Visible to buyers on the marketplace</p>
                </div>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Featured product</p>
                  <p className="text-xs text-muted-foreground">Highlighted on your shop page</p>
                </div>
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Halal certified</p>
                  <p className="text-xs text-muted-foreground">Display the Halal Certified badge</p>
                </div>
                <Switch
                  checked={form.isHalalCertified}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, isHalalCertified: v }))}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/seller/dashboard")}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none bg-primary"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEdit ? "Save Changes" : "Create Product"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
