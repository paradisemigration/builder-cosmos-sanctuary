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
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20"
      onClick={onClick}
    >
      <div className="relative">
        {business.coverImage && (
          <div className="h-48 bg-gradient-to-r from-primary/10 to-accent/10 rounded-t-lg overflow-hidden">
            <img
              src={business.coverImage}
              alt={`${business.name} cover`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {business.importedFromGoogle && (
          <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
            <Globe className="w-3 h-3 mr-1" />
            Google Import
          </Badge>
        )}
      </div>

      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {business.logo && (
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted border">
              <img
                src={business.logo}
                alt={`${business.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
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

            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(business.rating) ? "text-accent fill-accent" : "text-muted-foreground"}`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-foreground">
                {business.rating}
              </span>
              <span className="text-sm text-muted-foreground">
                ({business.reviewCount} reviews)
              </span>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {business.description}
            </p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="line-clamp-1">{business.address}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{business.phone}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {business.services.slice(0, 3).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
              {business.services.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{business.services.length - 3} more
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                View Details
              </Button>

              {business.whatsapp && (
                <Button size="sm" variant="outline" className="flex-shrink-0">
                  <MessageCircle className="w-4 h-4 mr-1" />
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
