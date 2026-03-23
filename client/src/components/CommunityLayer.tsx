import { useState } from "react";
import { Heart, UserPlus, UserCheck, Star, MessageSquare, ThumbsUp, Share2, ChevronRight, Package } from "lucide-react";
import { Link } from "wouter";

interface Review {
  id: number;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  likes: number;
  verified: boolean;
  hasImage?: boolean;
  imageEmoji?: string;
  product?: string;
}

const COMMUNITY_REVIEWS: Review[] = [
  {
    id: 1,
    author: "Umm Khalid",
    avatar: "",
    rating: 5,
    date: "2 days ago",
    text: "Absolutely beautiful abaya! The quality is mashallah excellent. Arrived quickly and the seller was very responsive. Will definitely order again for Eid!",
    likes: 24,
    verified: true,
    hasImage: true,
    imageEmoji: "",
    product: "Premium Nida Abaya",
  },
  {
    id: 2,
    author: "Brother Tariq",
    avatar: "",
    rating: 5,
    date: "5 days ago",
    text: "The hijama session was incredible. The practitioner was professional, knowledgeable and made me feel at ease. Highly recommend to the brothers!",
    likes: 18,
    verified: true,
    product: "Hijama Session",
  },
  {
    id: 3,
    author: "Sister Aisha",
    avatar: "",
    rating: 4,
    date: "1 week ago",
    text: "Good quality dates, arrived well packaged. Slightly smaller box than expected but the taste is amazing. Perfect for Ramadan iftar!",
    likes: 12,
    verified: true,
    hasImage: true,
    imageEmoji: "",
    product: "Medjool Dates 500g",
  },
  {
    id: 4,
    author: "Abu Musa",
    avatar: "",
    rating: 5,
    date: "2 weeks ago",
    text: "My daughter has been learning Arabic with Ustadha Fatima for 3 months now and her progress is mashallah remarkable. Very patient and knowledgeable teacher.",
    likes: 31,
    verified: true,
    product: "Arabic Lessons",
  },
];

interface FollowButtonProps {
  sellerId: number;
  sellerName: string;
  initialFollowing?: boolean;
}

export function FollowButton({ sellerId, sellerName, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);

  return (
    <button
      onClick={() => setFollowing(!following)}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
        following
          ? "bg-amber-100 text-amber-700 border border-amber-200"
          : "bg-amber-500 text-white hover:bg-amber-600"
      }`}
    >
      {following ? (
        <>
          <UserCheck className="w-3.5 h-3.5" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          Follow
        </>
      )}
    </button>
  );
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(review.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount((c) => c - 1);
    } else {
      setLikeCount((c) => c + 1);
    }
    setLiked(!liked);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-100 rounded-full flex items-center justify-center text-lg">
            <span className="text-xs font-bold text-primary">{review.author?.charAt(0) ?? "U"}</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-gray-900">{review.author}</p>
              {review.verified && (
                <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{review.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product Tag */}
      {review.product && (
        <p className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full inline-block mb-2">
          {review.product}
        </p>
      )}

      {/* Review Text */}
      <p className="text-sm text-gray-700 leading-relaxed mb-3">{review.text}</p>

      {/* Review Image */}
      {review.hasImage && (
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl mb-3">
          <Package className="w-8 h-8 text-muted-foreground" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1 text-xs transition-colors ${
            liked ? "text-amber-600" : "text-gray-400 hover:text-amber-500"
          }`}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${liked ? "fill-amber-500" : ""}`} />
          Helpful ({likeCount})
        </button>
        <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
    </div>
  );
}

export function CommunityReviews() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-amber-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-rose-500" />
              <h2 className="text-2xl font-bold text-gray-900">Community Reviews</h2>
            </div>
            <p className="text-gray-500 text-sm">
              Real reviews from verified buyers in the Noor community.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-gray-900">4.9</span>
              <span className="text-gray-400 text-sm">avg rating</span>
            </div>
            <Link href="/reviews">
              <button className="flex items-center gap-1.5 text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors">
                All Reviews
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMUNITY_REVIEWS.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Write a Review CTA */}
        <div className="text-center mt-8">
          <Link href="/profile?tab=orders">
            <button className="inline-flex items-center gap-2 bg-white border border-amber-300 text-amber-700 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-amber-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Write a Review
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CommunityReviews;
