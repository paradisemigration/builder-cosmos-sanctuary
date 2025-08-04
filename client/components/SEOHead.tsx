import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: any;
  country?: "india" | "uae";
}

export const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = "/images/og-default.jpg",
  ogType = "website",
  noindex = false,
  structuredData,
  country = "india"
}: SEOHeadProps) => {
  const fullTitle = title.includes("VisaConsult") ? title : `${title} - VisaConsult ${country === "uae" ? "UAE" : "India"}`;
  const currentUrl = canonicalUrl || window.location.href;
  
  // Default structured data for local business
  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": `VisaConsult ${country === "uae" ? "UAE" : "India"}`,
    "description": description,
    "url": currentUrl,
    "logo": `${window.location.origin}/images/logo.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": country === "uae" ? "+971-xxx-xxxx" : "+91-xxx-xxxx",
      "contactType": "customer service"
    },
    "areaServed": {
      "@type": "Country",
      "name": country === "uae" ? "United Arab Emirates" : "India"
    },
    "serviceType": "Visa Consultation Services"
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="utf-8" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={`VisaConsult ${country === "uae" ? "UAE" : "India"}`} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content={`VisaConsult ${country === "uae" ? "UAE" : "India"}`} />
      <meta name="language" content="en" />
      <meta name="geo.region" content={country === "uae" ? "AE" : "IN"} />
      <meta name="geo.country" content={country === "uae" ? "AE" : "IN"} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData || defaultStructuredData)}
      </script>
    </Helmet>
  );
};

// City page SEO helper
export const generateCitySEO = (city: string, country: "india" | "uae" = "india") => {
  const countryName = country === "uae" ? "UAE" : "India";
  return {
    title: `Best Visa Consultants in ${city}, ${countryName}`,
    description: `Find top-rated visa consultants in ${city}, ${countryName}. Compare immigration services, work visa specialists, study abroad consultants and more. Get expert visa assistance in ${city}.`,
    keywords: `visa consultants ${city}, immigration services ${city}, work visa ${city}, study abroad consultants ${city}, ${city} visa agents, visa processing ${city}`,
    canonicalUrl: `${window.location.origin}/business/${city.toLowerCase().replace(/\s+/g, "-")}`,
    country
  };
};

// Category page SEO helper
export const generateCategorySEO = (category: string, country: "india" | "uae" = "india") => {
  const countryName = country === "uae" ? "UAE" : "India";
  return {
    title: `Best ${category} in ${countryName}`,
    description: `Find top-rated ${category} across ${countryName}. Compare services, read reviews, and connect with trusted professionals. Expert ${category} services in ${countryName}.`,
    keywords: `${category} ${countryName}, best ${category}, ${category} services, professional ${category}`,
    canonicalUrl: `${window.location.origin}/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
    country
  };
};

// City + Category SEO helper
export const generateCityCategorySEO = (city: string, category: string, country: "india" | "uae" = "india") => {
  const countryName = country === "uae" ? "UAE" : "India";
  return {
    title: `Best ${category} in ${city}, ${countryName}`,
    description: `Find top-rated ${category} in ${city}, ${countryName}. Compare services, read reviews, and get expert assistance. Trusted ${category} professionals in ${city}.`,
    keywords: `${category} ${city}, ${category} services ${city}, best ${category} ${city}, professional ${category} ${city}`,
    canonicalUrl: `${window.location.origin}/business/${city.toLowerCase().replace(/\s+/g, "-")}/${category.toLowerCase().replace(/\s+/g, "-")}`,
    country
  };
};
