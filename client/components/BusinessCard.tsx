import {
  Star,
  MapPin,
  Phone,
  Globe,
  CheckCircle,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";
import { Business } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BusinessCardProps {
  business: Business;
  onClick?: () => void;
}

export function BusinessCard({ business, onClick }: BusinessCardProps) {
  return (
    <Card
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/30 hover:border-primary/30 bg-white/50 backdrop-blur-sm overflow-hidden"
      onClick={onClick}
    >
      <div className="relative">
        {business.coverImage && (
          <div className="h-40 sm:h-48 bg-gradient-to-r from-primary/10 to-accent/10 overflow-hidden">
            <img
              src={business.coverImage}
              alt={`${business.name} cover`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        )}

        {business.importedFromGoogle && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 text-xs shadow-sm"
          >
            <Globe className="w-3 h-3 mr-1" />
            Google Import
          </Badge>
        )}
      </div>

      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Mobile: Logo and Title Row */}
          <div className="flex items-start gap-4 sm:w-auto w-full">
            {business.logo && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-muted border-2 border-white shadow-sm">
                <img
                  src={business.logo}
                  alt={`${business.name} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex-1 min-w-0 sm:hidden">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {business.name}
                </h3>
                {business.isVerified && (
                  <Badge
                    variant="outline"
                    className="bg-verified/10 text-verified border-verified/20 flex-shrink-0"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    <span className="hidden xs:inline">Verified</span>
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs mb-2">
                {business.category}
              </Badge>
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(business.rating) ? "text-accent fill-accent" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground ml-1">
                  {business.rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({business.reviewCount})
                </span>
              </div>
            </div>
          </div>

          {/* Desktop and Mobile Content */}
          <div className="flex-1 min-w-0">
            {/* Desktop Title Row - Hidden on Mobile */}
            <div className="hidden sm:block">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {business.name}
                </h3>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {business.isVerified && (
                    <Badge
                      variant="outline"
                      className="bg-verified/10 text-verified border-verified/20"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}

                  {business.isScamReported && (
                    <Badge
                      variant="outline"
                      className="bg-warning/10 text-warning border-warning/20"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Reported
                    </Badge>
                  )}
                </div>
              </div>

              <Badge variant="outline" className="mb-3 text-xs">
                {business.category}
              </Badge>

              <div className="flex items-center gap-1 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(business.rating) ? "text-accent fill-accent" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground ml-1">
                  {business.rating}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({business.reviewCount} reviews)
                </span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {business.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{business.address}</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{business.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {business.services.slice(0, 4).map((service, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  {service}
                </Badge>
              ))}
              {business.services.length > 4 && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  +{business.services.length - 4} more
                </Badge>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button
                size="sm"
                className="flex-1 sm:flex-none sm:min-w-[140px] rounded-lg font-medium"
              >
                View Details
              </Button>

              {business.whatsapp && (
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 sm:flex-none rounded-lg"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
