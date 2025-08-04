import { useParams, Navigate } from "react-router-dom";
import { allCategorySlugs } from "@/lib/all-categories";
import CityCategory from "@/pages/CityCategory";
import BusinessProfile from "@/pages/BusinessProfile";

export default function CityRouteHandler() {
  const { city, category } = useParams<{ city: string; category: string }>();

  // If no category is provided, this shouldn't happen
  if (!category) {
    return <Navigate to="/business" replace />;
  }

  // Check if the second parameter is a known category slug
  const isCategory = allCategorySlugs.includes(category);

  if (isCategory) {
    // Show category page
    return <CityCategory />;
  } else {
    // Show business profile (treating category as companyName)
    return <BusinessProfile />;
  }
}
