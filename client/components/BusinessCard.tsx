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
import { type Business } from "@/lib/data";

interface BusinessCardProps {
  business: Business;
  className?: string;
}

export function BusinessCard({ business, className = "" }: BusinessCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [imageError, setImageError] = useState(false);

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
  const businessUrl = `/${citySlug}/${nameSlug}`;

  // Debug: log the generated URL in development
  if (process.env.NODE_ENV === "development") {
    console.log("Business URL generated:", {
      city: business.city,
      name: business.name,
      citySlug,
      nameSlug,
      finalUrl: businessUrl,
    });
  }

  const handleShare = (e: React.MouseEvent) => {
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

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
    >
      <Link to={businessUrl} className="block">
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
              {business.logo ? (
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
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{business.rating}</span>
                  <span>({business.reviewCount})</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>{business.city}</span>
                </div>
              </div>
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
              {business.specializations.slice(0, 3).map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
              {business.specializations.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{business.specializations.length - 3} more
                </Badge>
              )}
            </div>
          </div>

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
                {business.countriesServed.length}+
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
                {business.languages.slice(0, 2).join(", ")}
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
