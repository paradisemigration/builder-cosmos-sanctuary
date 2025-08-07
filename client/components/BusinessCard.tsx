import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  CheckCircle,
  Award,
  Users,
  Clock,
  Heart,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Business } from "@/lib/data";

export function BusinessCard({ business, className = "" }: BusinessCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate consistent success ratio based on business name (deterministic but appears random)
  const generateSuccessRatio = (businessName: string) => {
    let hash = 0;
    for (let i = 0; i < businessName.length; i++) {
      const char = businessName.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Map hash to range 50-90
    return 50 + (Math.abs(hash) % 41);
  };

  // Generate consistent review count based on business name (deterministic)
  const generateReviewCount = (businessName: string) => {
    let hash = 0;
    for (let i = 0; i < businessName.length; i++) {
      const char = businessName.charCodeAt(i);
      hash = (hash << 7) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    // Map hash to range 45-350 for realistic review counts
    return 45 + (Math.abs(hash) % 306);
  };

  // Generate recent reviewer names
  const generateRecentReviewers = (businessName: string) => {
    const commonNames = [
      "Ahmed Al-Mansouri",
      "Sarah Johnson",
      "Mohammed Hassan",
      "Emily Chen",
      "David Smith",
      "Fatima Al-Zahra",
      "James Wilson",
      "Aisha Patel",
      "Michael Brown",
      "Nour Khalil",
      "Jennifer Davis",
      "Omar Abdullah",
      "Lisa Thompson",
      "Hassan Al-Ahmad",
      "Maria Garcia",
      "Ali Rahman",
      "Sophie Martin",
      "Ravi Kumar",
      "Grace Kim",
      "Youssef Ibrahim",
      "Layla Hassan",
      "John Miller",
      "Zara Ahmed",
      "Carlos Rodriguez",
      "Priya Sharma",
    ];

    let hash = 0;
    for (let i = 0; i < businessName.length; i++) {
      hash = (hash << 5) - hash + businessName.charCodeAt(i);
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Select 3-5 reviewers deterministically
    const reviewerCount = 3 + (Math.abs(hash) % 3);
    const selectedReviewers = [];

    // Ensure we get unique reviewers
    for (let i = 0; i < reviewerCount && selectedReviewers.length < 5; i++) {
      const index = Math.abs(hash + i * 13) % commonNames.length;
      const reviewer = commonNames[index];
      if (!selectedReviewers.includes(reviewer)) {
        selectedReviewers.push(reviewer);
      }
    }

    // Ensure we have at least 3 reviewers
    while (selectedReviewers.length < 3) {
      const randomIndex =
        Math.abs(hash + selectedReviewers.length * 17) % commonNames.length;
      const reviewer = commonNames[randomIndex];
      if (!selectedReviewers.includes(reviewer)) {
        selectedReviewers.push(reviewer);
      }
    }

    return selectedReviewers;
  };

  const successRatio = generateSuccessRatio(business.name);

  // Get actual reviewer names from business reviews or generate fallback names
  const getReviewerNames = () => {
    // Debug: Log review data to console
    if (business.reviews && business.reviews.length > 0) {
      console.log(
        `${business.name} has ${business.reviews.length} reviews:`,
        business.reviews.map((r) => r.userName),
      );
      // Use actual reviewer names from the business data
      const realReviewers = business.reviews
        .filter(
          (review) =>
            review.userName &&
            review.userName !== "Anonymous" &&
            review.userName.trim() !== "",
        )
        .map((review) => review.userName)
        .slice(0, 5); // Get up to 5 reviewer names

      if (realReviewers.length > 0) {
        console.log(
          `Using real reviewers for ${business.name}:`,
          realReviewers,
        );
        return realReviewers;
      }
    }

    // Debug: Log when using generated names
    const generatedNames = generateRecentReviewers(business.name);
    console.log(
      `Using generated reviewers for ${business.name}:`,
      generatedNames,
    );
    return generatedNames;
  };

  const recentReviewers = getReviewerNames();
  const reviewCount =
    business.reviews?.length ||
    business.reviewCount ||
    generateReviewCount(business.name);

  // Generate SEO-friendly URL slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  // Ensure we have valid city and name for URL generation
  const citySlug = generateSlug(business.city || "unknown");
  const nameSlug = generateSlug(business.name || "business");
  const businessId = business.googlePlaceId || business.id;
  const businessUrl = `/business/${citySlug}/${nameSlug}?id=${businessId}`;

  // Debug: log the generated URL always for testing
  console.log("Business URL generated:", {
    originalCity: business.city,
    originalName: business.name,
    citySlug,
    nameSlug,
    finalUrl: businessUrl,
    expectedForDelhi:
      business.city === "Delhi" &&
      business.name === "Delhi Global Visa Consultants",
  });

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: business.name,
        text: `Check out ${business.name} - ${business.category} in ${business.city}`,
        url: businessUrl,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}${businessUrl}`);
      alert("Link copied to clipboard!");
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (process.env.NODE_ENV === "development") {
      console.log("Business card clicked:", {
        business: business.name,
        city: business.city,
        url: businessUrl,
        targetUrl: businessUrl,
      });
    }
  };

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
      data-business-card={business.name}
      data-business-url={businessUrl}
    >
      <Link to={businessUrl} className="block" onClick={handleCardClick}>
        {/* Header with Cover Image */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          {business.coverImage && !imageError ? (
            <img
              src={business.coverImage}
              alt={`${business.name} cover`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
          )}

          {/* Plan Badge */}
          {business.plan !== "free" && (
            <div className="absolute top-3 left-3">
              <Badge
                className={`${
                  business.plan === "business"
                    ? "bg-purple-600 text-white"
                    : "bg-orange-600 text-white"
                }`}
              >
                {business.plan === "business" ? "Featured" : "Premium"}
              </Badge>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* Logo */}
          <div className="absolute -bottom-6 left-4">
            <div className="w-12 h-12 rounded-lg bg-white shadow-lg flex items-center justify-center overflow-hidden">
              {business.logo && business.logo !== "/api/placeholder/80/80" ? (
                <img
                  src={business.logo}
                  alt={`${business.name} logo`}
                  className="w-10 h-10 object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.parentElement!.innerHTML = `<div class="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">${getInitials(business.name)}</div>`;
                  }}
                />
              ) : (
                <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-xs font-bold text-blue-600">
                  {getInitials(business.name)}
                </div>
              )}
            </div>
          </div>
        </div>

        <CardHeader className="pt-8 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {business.name}
                </h3>
                {business.isVerified && (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                )}
              </div>
              <p className="text-sm text-blue-600 font-medium mb-2">
                {business.category}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{business.rating}</span>
                  <span className="text-gray-500">({reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {business.address
                      ? business.address.split(",")[0]
                      : business.city}
                  </span>
                </div>
              </div>

              {/* Success Ratio */}
              <div className="flex items-center gap-4 text-sm mb-2">
                <div className="flex items-center gap-1">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">
                    {successRatio}% Success Rate
                  </span>
                </div>
              </div>

              {/* Recent Reviewers */}
              {recentReviewers.length > 0 && (
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Recent reviews:</span>{" "}
                  <span className="text-blue-600">
                    {recentReviewers.slice(0, 2).join(", ")}
                  </span>
                  {recentReviewers.length > 2 && (
                    <span className="text-gray-500">
                      {" "}
                      +{recentReviewers.length - 2} more
                    </span>
                  )}
                  {business.reviews && business.reviews.length > 0 && (
                    <span className="text-green-600 ml-1">✓</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {business.description}
          </p>

          {/* Services/Specializations */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {(business.specializations || [])
                .slice(0, 3)
                .map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              {(business.specializations || []).length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{(business.specializations || []).length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          {business.reviews && business.reviews.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400" />
                Recent Reviews
              </h4>
              <div className="space-y-2">
                {business.reviews.slice(0, 2).map((review, index) => (
                  <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-medium text-gray-600">
                        {review.authorName || "Anonymous"}
                      </span>
                    </div>
                    <p className="text-gray-600 line-clamp-2">
                      {review.text || review.comment || "Great service!"}
                    </p>
                  </div>
                ))}
                {business.reviews.length > 2 && (
                  <div className="text-xs text-blue-600 font-medium">
                    +{business.reviews.length - 2} more reviews
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">
                {business.successRate}%
              </div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">
                {business.establishedYear
                  ? 2024 - business.establishedYear
                  : 10}
                +
              </div>
              <div className="text-xs text-gray-500">Years Exp.</div>
            </div>
            <div>
              <div className="text-lg font-bold text-purple-600">
                {(business.countriesServed || []).length}+
              </div>
              <div className="text-xs text-gray-500">Countries</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.preventDefault();
                window.open(`tel:${business.phone}`, "_self");
              }}
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            {business.website && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(business.website, "_blank");
                }}
              >
                <Globe className="h-4 w-4 mr-1" />
                Website
              </Button>
            )}
          </div>

          {/* Business Hours Indicator */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-green-600">
                <Clock className="h-3 w-3" />
                <span>Open Now</span>
              </div>
              <div className="text-gray-500">
                {(business.languages || []).slice(0, 2).join(", ") ||
                  "Hindi, English"}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
