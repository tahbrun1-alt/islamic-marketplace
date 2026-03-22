import { useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImagePlus, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 5,
  label = "Product Images",
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const uploadMutation = trpc.upload.image.useMutation({
    onError: (e) => {
      toast.error(`Upload failed: ${e.message}`);
      setUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    const toUpload = files.slice(0, remaining);
    setUploading(true);

    const results: string[] = [];
    for (const file of toUpload) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        continue;
      }
      try {
        const base64 = await fileToBase64(file);
        const { url } = await uploadMutation.mutateAsync({
          base64,
          mimeType: file.type,
          filename: file.name,
        });
        results.push(url);
      } catch {
        // error already shown via onError
      }
    }

    if (results.length > 0) {
      onChange([...images, ...results]);
      toast.success(`${results.length} image${results.length > 1 ? "s" : ""} uploaded`);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http")) {
      toast.error("Please enter a valid URL starting with http");
      return;
    }
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    onChange([...images, url]);
    setUrlInput("");
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-secondary">
              <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <div className="absolute bottom-1 left-1">
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    style={{ background: "oklch(0.18 0.025 40 / 0.75)", color: "oklch(0.92 0.018 86)" }}>
                    Cover
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-1 transition-colors group"
            >
              {uploading ? (
                <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              ) : (
                <>
                  <ImagePlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-[10px] text-muted-foreground">Add</span>
                </>
              )}
            </button>
          )}
        </div>
      )}

      {/* Upload area (shown when no images) */}
      {images.length === 0 && (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full h-32 rounded-xl border-2 border-dashed border-border hover:border-primary flex flex-col items-center justify-center gap-2 transition-colors group"
        >
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              <span className="text-sm text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium text-foreground">Click to upload images</span>
              <span className="text-xs text-muted-foreground">JPG, PNG, WebP up to 5MB each · Max {maxImages} images</span>
            </>
          )}
        </button>
      )}

      {/* URL input as alternative */}
      <div className="flex gap-2">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddUrl())}
          placeholder="Or paste an image URL..."
          className="flex-1 px-3 py-2 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
        <Button type="button" variant="outline" size="sm" onClick={handleAddUrl}
          disabled={!urlInput.trim() || images.length >= maxImages}>
          Add URL
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} images · First image is the cover photo
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

// Helper: convert File to base64 string
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (e.g. "data:image/jpeg;base64,")
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
