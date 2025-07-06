import { useState } from "react";
import { Star, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

// Google Icon Component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Facebook Icon Component
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessId: string;
  onReviewSubmitted: (review: {
    rating: number;
    comment: string;
    userName: string;
    userAvatar?: string;
  }) => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  businessName,
  businessId,
  onReviewSubmitted,
}: ReviewModalProps) {
  const {
    user,
    isAuthenticated,
    loginWithGoogle,
    loginWithFacebook,
    isLoading,
  } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    try {
      let success = false;
      if (provider === "google") {
        success = await loginWithGoogle();
      } else {
        success = await loginWithFacebook();
      }

      if (!success) {
        alert(`Failed to login with ${provider}. Please try again.`);
      }
    } catch (error) {
      alert(`Error logging in with ${provider}. Please try again.`);
    }
  };

  const handleSubmitReview = async () => {
    if (!user || !comment.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create review object
    const newReview = {
      rating,
      comment: comment.trim(),
      userName: user.name,
      userAvatar: user.avatar,
    };

    onReviewSubmitted(newReview);

    // Reset form
    setComment("");
    setRating(5);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Write a Review</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Review for <span className="font-semibold">{businessName}</span>
            </p>
          </div>

          {!isAuthenticated ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Please sign in to write a review
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                >
                  <GoogleIcon />
                  <span className="ml-3">
                    {isLoading ? "Signing in..." : "Continue with Google"}
                  </span>
                </Button>

                <Button
                  variant="outline"
                  className="w-full h-12"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isLoading}
                >
                  <FacebookIcon />
                  <span className="ml-3">
                    {isLoading ? "Signing in..." : "Continue with Facebook"}
                  </span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  We use social login to verify authentic reviews
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">
                    via{" "}
                    {user.provider === "google"
                      ? "Google"
                      : user.provider === "facebook"
                        ? "Facebook"
                        : "Email"}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium">Rating</Label>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? "text-accent fill-accent"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({rating} star{rating !== 1 ? "s" : ""})
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  id="comment"
                  placeholder="Share your experience with this business..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mt-2 min-h-[100px]"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {comment.length}/500 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                className="w-full"
                disabled={!comment.trim() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
