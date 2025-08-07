import { useParams, Navigate } from "react-router-dom";
import { allCategorySlugs } from "@/lib/all-categories";
import CityCategory from "@/pages/CityCategory";
import CityBusinessListing from "@/pages/CityBusinessListing";
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

export default function CityRouteHandler({ country = "india" }) {
  const { city, category } = useParams();

  console.log("🏙️ CityRouteHandler:", { city, category, country });

  // If no category is provided, show city business listing
  if (!category) {
    console.log("📍 Showing city business listing for:", city);
    return <CityBusinessListing />;
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
      const redirectPath = country === "uae"
        ? `/uae/${city}/${actualCategory}`
        : `/business/${city}/${actualCategory}`;
      return <Navigate to={redirectPath} replace />;
    }
    // Show category page for city + category
    console.log("🏷️ Showing city category page for:", { city, category: actualCategory });
    return <CityCategory />;
  } else {
    // This might be a business name or ID, show business profile
    console.log("🏢 Showing business profile for:", category);
    return <BusinessProfile />;
  }
}
