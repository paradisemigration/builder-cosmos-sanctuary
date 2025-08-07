import { useParams, Navigate } from "react-router-dom";
import { allCategorySlugs } from "@/lib/all-categories";
import CityCategory from "@/pages/CityCategory";
import BusinessProfile from "@/pages/BusinessProfile";

// Category aliases for common URL variations
const categoryAliases = {
  "study-abroad": "study-abroad-consultants",
  immigration: "immigration-consultants",
  visa: "visa-consultants",
  "work-visa": "work-visa-consultants",
  "tourist-visa": "tourist-visa-services",
  "student-visa": "student-visa-consultants",
  "visit-visa": "visit-visa-specialists",
  "work-permit": "work-visa-consultants",
  "pr-consultants": "pr-citizenship-services",
  education: "education-consultants",
  "education-services": "education-consultants",
  "business-visa": "business-visa-services",
  "overseas-education": "overseas-education",
  "student-services": "student-visa-services",
};

export default function CityRouteHandler() {
  const { city, category } = useParams();

  // If no category is provided, this shouldn't happen
  if (!category) {
    return <Navigate to="/browse" replace />;
  }

  // Check if the parameter is a known category slug or has an alias
  let actualCategory = category;
  if (categoryAliases[category]) {
    actualCategory = categoryAliases[category];
  }

  const isCategory = allCategorySlugs.includes(actualCategory);

  if (isCategory) {
    // Redirect to the correct category slug if we used an alias
    if (actualCategory !== category) {
      return <Navigate to={`/business/${city}/${actualCategory}`} replace />;
    }
    // Show category page
    return <CityCategory />;
  } else {
    // Show business profile (treating category as companyName)
    return <BusinessProfile />;
  }
}
