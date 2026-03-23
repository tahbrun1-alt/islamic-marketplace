import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, ImagePlus, Video, X, CheckCircle, ThumbsUp,
  MessageSquare, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ReviewSectionProps {
  type: "product" | "service" | "shop";
  targetId: number;
  targetTitle?: string;
  orderId?: number;
  bookingId?: number;
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="focus:outline-none"
          aria-label={`${s} stars`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              s <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-border"
            }`}
          />
        </button>
      ))}
      {(hovered || value) > 0 && (
        <span className="text-sm text-muted-foreground ml-2">
          {labels[hovered || value]}
        </span>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const images = (review.images as string[]) ?? [];
  const videos = (review.videos as string[]) ?? [];

  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">
              {review.author?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {review.author?.name ?? "Anonymous"}
            </p>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= review.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
        {review.isVerifiedPurchase && (
          <Badge className="bg-emerald-50 text-emerald-700 border-0 text-xs gap-1 shrink-0">
            <CheckCircle className="w-3 h-3" /> Verified Purchase
          </Badge>
        )}
      </div>

      {review.title && (
        <p className="text-sm font-semibold text-foreground">{review.title}</p>
      )}
      {review.body && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.body}
        </p>
      )}

      {/* Images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer">
              <img
                src={img}
                alt={`Review image ${i + 1}`}
                className="w-20 h-20 object-cover rounded-lg border border-border hover:opacity-90 transition-opacity"
              />
            </a>
          ))}
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {videos.map((vid, i) => (
            <video
              key={i}
              src={vid}
              controls
              className="w-48 rounded-lg border border-border"
              style={{ maxHeight: 120 }}
            />
          ))}
        </div>
      )}

      {/* Seller reply */}
      {review.sellerReply && (
        <div className="bg-secondary rounded-lg p-3 mt-2">
          <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-primary" /> Seller Response
          </p>
          <p className="text-xs text-muted-foreground">{review.sellerReply}</p>
        </div>
      )}
    </div>
  );
}

export default function ReviewSection({
  type,
  targetId,
  targetTitle,
  orderId,
  bookingId,
}: ReviewSectionProps) {
  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { data: reviews, refetch } = trpc.reviews.list.useQuery({
    type,
    targetId,
  });

  const createReview = trpc.reviews.create.useMutation({
    onSuccess: () => {
      toast.success("Review submitted — thank you!");
      setShowForm(false);
      setRating(0);
      setTitle("");
      setBody("");
      setImages([]);
      setVideos([]);
      refetch();
    },
    onError: (e) => {
      toast.error(e.message === "CONFLICT" ? "You have already reviewed this" : "Failed to submit review");
    },
  });

  const uploadFile = trpc.upload.image.useMutation();
  const uploadVideo = trpc.upload.file.useMutation();

  const handleImageFiles = async (files: FileList) => {
    setUploadingImages(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((res) => {
          reader.onload = () => res((reader.result as string).split(",")[1]);
          reader.readAsDataURL(file);
        });
        const result = await uploadFile.mutateAsync({
          base64,
          mimeType: file.type,
          filename: file.name,
        });
        urls.push(result.url);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setImages((prev) => [...prev, ...urls].slice(0, 6));
    setUploadingImages(false);
  };

  const handleVideoFiles = async (files: FileList) => {
    setUploadingVideos(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 50MB)`);
        continue;
      }
      try {
        const reader = new FileReader();
        const base64 = await new Promise<string>((res) => {
          reader.onload = () => res((reader.result as string).split(",")[1]);
          reader.readAsDataURL(file);
        });
        const result = await uploadVideo.mutateAsync({
          base64,
          mimeType: file.type,
          filename: file.name,
        });
        urls.push(result.url);
      } catch {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    setVideos((prev) => [...prev, ...urls].slice(0, 2));
    setUploadingVideos(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    createReview.mutate({
      type,
      targetId,
      rating,
      title: title.trim() || undefined,
      body: body.trim() || undefined,
      images: images.length ? images : undefined,
      videos: videos.length ? videos : undefined,
      orderId,
      bookingId,
    });
  };

  const displayedReviews = showAll ? (reviews ?? []) : (reviews ?? []).slice(0, 3);
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Reviews {reviews && reviews.length > 0 && `(${reviews.length})`}
          </h2>
          {avgRating > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(avgRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">
                out of 5
              </span>
            </div>
          )}
        </div>
        {isAuthenticated && !showForm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(true)}
          >
            <Star className="w-4 h-4 mr-2" /> Write a Review
          </Button>
        )}
      </div>

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="border border-border rounded-xl p-5 mb-6 space-y-4 bg-secondary/30"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {targetTitle ? `Review: ${targetTitle}` : "Write a Review"}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Star rating */}
              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Your Rating
                </p>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              {/* Title */}
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Title <span className="text-muted-foreground font-normal">(optional)</span>
                </p>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarise your experience"
                  maxLength={256}
                />
              </div>

              {/* Body */}
              <div>
                <p className="text-sm font-medium text-foreground mb-1">
                  Your Review <span className="text-muted-foreground font-normal">(optional)</span>
                </p>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Share details about your experience — quality, delivery, communication..."
                  rows={4}
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  {body.length}/2000
                </p>
              </div>

              {/* Media uploads */}
              <div className="flex flex-wrap gap-3">
                {/* Image upload */}
                <div>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleImageFiles(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingImages || images.length >= 6}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    <ImagePlus className="w-4 h-4 mr-2" />
                    {uploadingImages ? "Uploading..." : `Photos (${images.length}/6)`}
                  </Button>
                </div>

                {/* Video upload */}
                <div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleVideoFiles(e.target.files)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploadingVideos || videos.length >= 2}
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {uploadingVideos ? "Uploading..." : `Videos (${videos.length}/2)`}
                  </Button>
                </div>
              </div>

              {/* Image previews */}
              {images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt=""
                        className="w-20 h-20 object-cover rounded-lg border border-border"
                      />
                      <button
                        type="button"
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Video previews */}
              {videos.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {videos.map((vid, i) => (
                    <div key={i} className="relative group">
                      <video
                        src={vid}
                        className="w-32 rounded-lg border border-border"
                        style={{ maxHeight: 72 }}
                      />
                      <button
                        type="button"
                        onClick={() => setVideos((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={rating === 0 || createReview.isPending}
                  style={{
                    background: "linear-gradient(135deg, oklch(0.83 0.19 88), oklch(0.72 0.21 85))",
                  }}
                  className="text-primary-foreground"
                >
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review list */}
      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground border border-border rounded-xl">
          <ThumbsUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No reviews yet. Be the first to share your experience.</p>
          {isAuthenticated && !showForm && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setShowForm(true)}
            >
              Write the first review
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}

          {reviews.length > 3 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary hover:underline"
            >
              {showAll ? (
                <>
                  <ChevronUp className="w-4 h-4" /> Show fewer
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" /> Show all {reviews.length} reviews
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
