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
  ArrowLeft, Save, Calendar, Image as ImageIcon, Tag, DollarSign,
  Clock, Loader2, Plus, X, AlertCircle, MapPin
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

const SERVICE_CATEGORIES = [
  { id: 9, name: "Quran & Islamic Education" },
  { id: 10, name: "Wedding & Events" },
  { id: 11, name: "Catering & Halal Food" },
  { id: 12, name: "Photography & Videography" },
  { id: 13, name: "Henna & Beauty" },
  { id: 14, name: "Islamic Counselling" },
  { id: 15, name: "Tailoring & Alterations" },
  { id: 16, name: "Home Services" },
];

interface ServiceFormData {
  title: string;
  description: string;
  price: string;
  pricingType: "fixed" | "hourly" | "custom";
  depositAmount: string;
  requireDeposit: boolean;
  duration: string;
  location: string;
  locationType: "in_person" | "online" | "at_client" | "at_provider";
  categoryId: string;
  tags: string[];
  isActive: boolean;
  isHalalCertified: boolean;
  images: string[];
  availability: string;
}

const defaultForm: ServiceFormData = {
  title: "",
  description: "",
  price: "",
  pricingType: "fixed",
  depositAmount: "",
  requireDeposit: false,
  duration: "60",
  location: "",
  locationType: "in_person",
  categoryId: "",
  tags: [],
  isActive: true,
  isHalalCertified: false,
  images: [],
  availability: "",
};

export default function ServiceForm() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const isEdit = !!id && id !== "new";

  const [form, setForm] = useState<ServiceFormData>(defaultForm);
  const [tagInput, setTagInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceFormData, string>>>({});

  const { data: service, isLoading: serviceLoading } = trpc.services.getById.useQuery(
    { id: parseInt(id!) },
    { enabled: isEdit && !!id }
  );

  const createMutation = trpc.services.create.useMutation({
    onSuccess: () => {
      toast.success("Service listed successfully!");
      navigate("/seller/dashboard");
    },
    onError: (err) => toast.error(err.message || "Failed to create service"),
  });

  const updateMutation = trpc.services.update.useMutation({
    onSuccess: () => {
      toast.success("Service updated successfully!");
      navigate("/seller/dashboard");
    },
    onError: (err) => toast.error(err.message || "Failed to update service"),
  });

  useEffect(() => {
    if (service && isEdit) {
      setForm({
        title: service.title || "",
        description: service.description || "",
        price: service.price?.toString() || "",
        pricingType: "fixed",
        depositAmount: service.depositAmount?.toString() || "",
        requireDeposit: (service as any).requireDeposit ?? false,
        duration: service.duration?.toString() || "60",
        location: (service as any).address || "",
        locationType: (service.locationType as "in_person" | "online" | "at_client" | "at_provider") || "in_person",
        categoryId: service.categoryId?.toString() || "",
        tags: (service.tags as string[]) || [],
        isActive: service.isActive ?? true,
        isHalalCertified: (service as any).isHalalCertified ?? false,
        images: (service.images as string[]) || [],
        availability: typeof service.availability === "string" ? service.availability : "",
      });
    }
  }, [service, isEdit]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ServiceFormData, string>> = {};
    if (!form.title.trim()) newErrors.title = "Service name is required";
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "Valid price is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (form.requireDeposit && (!form.depositAmount || parseFloat(form.depositAmount) <= 0)) {
      newErrors.depositAmount = "Deposit amount is required when deposit is enabled";
    }
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
      pricingType: form.pricingType,
      depositAmount: form.requireDeposit && form.depositAmount ? parseFloat(form.depositAmount) : undefined,
      requireDeposit: form.requireDeposit,
      duration: parseInt(form.duration) || 60,
      address: form.location.trim() || undefined,
      locationType: form.locationType,
      categoryId: form.categoryId ? parseInt(form.categoryId) : undefined,
      tags: form.tags,
      isActive: form.isActive,
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
          <p className="text-muted-foreground">Please sign in to manage services.</p>
        </div>
      </div>
    );
  }

  if (isEdit && serviceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isEdit && !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
          <p className="text-muted-foreground">Service not found or you don't have permission to edit it.</p>
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
          <Button variant="ghost" size="icon" onClick={() => navigate("/seller/dashboard")} className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {isEdit ? "Edit Service" : "Add New Service"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit ? `Editing: ${service?.title}` : "Create a new service listing for your shop"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Service Details</h2>
            </div>

            <div>
              <Label htmlFor="title">Service Name *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Quran Tutoring for Beginners"
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
                placeholder="Describe your service in detail — what's included, your experience, what clients can expect..."
                rows={5}
                className={`mt-1 ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={form.categoryId} onValueChange={(v) => setForm((f) => ({ ...f, categoryId: v }))}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationType">Delivery Method</Label>
                <Select value={form.locationType} onValueChange={(v) => setForm((f) => ({ ...f, locationType: v as "in_person" | "online" | "at_client" | "at_provider" }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_person">In Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="at_client">At Client's Location</SelectItem>
                    <SelectItem value="at_provider">At My Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  step="15"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            {(form.locationType === "in_person" || form.locationType === "at_client" || form.locationType === "at_provider") && (
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative mt-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. East London, UK"
                    className="pl-9"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-card border rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Pricing</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricingType">Pricing Type</Label>
                <Select value={form.pricingType} onValueChange={(v) => setForm((f) => ({ ...f, pricingType: v as typeof form.pricingType }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="hourly">Per Hour</SelectItem>
                    <SelectItem value="custom">Custom Quote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="price">
                  {form.pricingType === "hourly" ? "Price per Hour (£)" : "Price (£)"} *
                </Label>
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
            </div>

            <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground">Require booking deposit</p>
                <p className="text-xs text-muted-foreground">Clients pay a deposit to secure their booking</p>
              </div>
              <Switch
                checked={form.requireDeposit}
                onCheckedChange={(v) => setForm((f) => ({ ...f, requireDeposit: v }))}
              />
            </div>

            {form.requireDeposit && (
              <div>
                <Label htmlFor="depositAmount">Deposit Amount (£) *</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  value={form.depositAmount}
                  onChange={(e) => setForm((f) => ({ ...f, depositAmount: e.target.value }))}
                  placeholder="e.g. 50.00"
                  className={`mt-1 ${errors.depositAmount ? "border-destructive" : ""}`}
                />
                {errors.depositAmount && <p className="text-xs text-destructive mt-1">{errors.depositAmount}</p>}
              </div>
            )}
          </div>

          {/* Images */}
          <div className="bg-card border rounded-xl p-6">
            <ImageUploader
              images={form.images}
              onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
              maxImages={6}
              label="Service Images"
            />
          </div>

          {/* Tags */}
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Tags</h2>
            </div>
            <div className="flex gap-2">
              <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag (e.g. quran, tutoring, online)"
                className="flex-1"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } if (e.key === ",") { e.preventDefault(); addTag(); } }} />
              <Button type="button" variant="outline" onClick={addTag} disabled={!tagInput.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {form.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive transition-colors">
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
              <Clock className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Listing Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Active listing</p>
                  <p className="text-xs text-muted-foreground">Visible to clients on the marketplace</p>
                </div>
                <Switch checked={form.isActive} onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Halal certified service</p>
                  <p className="text-xs text-muted-foreground">Display the Halal Certified badge</p>
                </div>
                <Switch checked={form.isHalalCertified} onCheckedChange={(v) => setForm((f) => ({ ...f, isHalalCertified: v }))} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <Button type="button" variant="outline" onClick={() => navigate("/seller/dashboard")} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 sm:flex-none bg-primary">
              {isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />{isEdit ? "Saving..." : "Creating..."}</>
              ) : (
                <><Save className="w-4 h-4 mr-2" />{isEdit ? "Save Changes" : "Create Service"}</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
