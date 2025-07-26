// Meta utility functions for consistent SEO across all pages

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
}

// Generate meta data for city-category pages
export function generateCityCategoryMeta(cityName: string, categoryName: string): MetaData {
  return {
    title: `Top 10 ${categoryName} In ${cityName} - VisaConsult India`,
    description: `Find the top 10 ${categoryName.toLowerCase()} in ${cityName}. Compare ratings, reviews, and services of verified ${categoryName.toLowerCase()} at VisaConsult India. Expert guidance for all your visa needs.`,
    keywords: `${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} in ${cityName.toLowerCase()}, visa consultants ${cityName.toLowerCase()}, immigration services ${cityName.toLowerCase()}, ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, best ${categoryName.toLowerCase()}, top ${categoryName.toLowerCase()}`
  };
}

// Generate meta data for category-only pages
export function generateCategoryMeta(categoryName: string, categoryDescription: string): MetaData {
  return {
    title: `Best ${categoryName} In India & UAE - VisaConsult India`,
    description: `Find the best ${categoryName.toLowerCase()} across India and UAE. Compare top-rated ${categoryName.toLowerCase()} in 100+ cities. ${categoryDescription} Get expert visa guidance at VisaConsult India.`,
    keywords: `${categoryName.toLowerCase()}, best ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} india, ${categoryName.toLowerCase()} uae, visa consultants, immigration services, ${categoryName.toLowerCase().replace(/\s+/g, ' ')}`
  };
}

// Generate meta data for city-only pages
export function generateCityMeta(cityName: string): MetaData {
  return {
    title: `Top 10 Visa Consultants In ${cityName} - VisaConsult India`,
    description: `Find the top 10 visa consultants in ${cityName}. Compare ratings, reviews, and services of verified immigration experts. Get expert guidance for student visa, work visa, tourist visa, and more at VisaConsult India.`,
    keywords: `visa consultants ${cityName.toLowerCase()}, immigration consultants ${cityName.toLowerCase()}, best visa agents ${cityName.toLowerCase()}, visa services ${cityName.toLowerCase()}, study abroad ${cityName.toLowerCase()}, work visa ${cityName.toLowerCase()}, tourist visa ${cityName.toLowerCase()}`
  };
}

// Generate meta data for business profile pages
export function generateBusinessMeta(businessName: string, cityName: string, categoryName: string): MetaData {
  return {
    title: `${businessName} - ${categoryName} In ${cityName} | VisaConsult India`,
    description: `${businessName} is a trusted ${categoryName.toLowerCase()} in ${cityName}. Read reviews, check ratings, and get expert visa consultation services. Contact ${businessName} for professional immigration guidance.`,
    keywords: `${businessName}, ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, visa consultants, immigration services, ${businessName.toLowerCase().replace(/\s+/g, ' ')}`
  };
}

// Apply meta data to document
export function setPageMeta(metaData: MetaData): void {
  // Set title
  document.title = metaData.title;
  
  // Set meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', metaData.description);
  
  // Set meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', metaData.keywords);
  
  // Set Open Graph meta tags
  setOpenGraphMeta(metaData);
}

// Set Open Graph meta tags for social media sharing
function setOpenGraphMeta(metaData: MetaData): void {
  const ogTags = [
    { property: 'og:title', content: metaData.title },
    { property: 'og:description', content: metaData.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'VisaConsult India' },
    { property: 'og:locale', content: 'en_IN' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metaData.title },
    { name: 'twitter:description', content: metaData.description },
  ];

  ogTags.forEach(tag => {
    const property = tag.property || tag.name;
    const attribute = tag.property ? 'property' : 'name';
    
    let metaTag = document.querySelector(`meta[${attribute}="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', tag.content);
  });
}

// Generate structured data for local business
export function generateBusinessStructuredData(
  businessName: string,
  cityName: string,
  categoryName: string,
  address?: string,
  phone?: string,
  rating?: number,
  reviewCount?: number
): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": businessName,
    "description": `${categoryName} in ${cityName}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressCountry": "IN"
    },
    "telephone": phone,
    "url": window.location.href,
    "category": categoryName,
    "aggregateRating": rating && reviewCount ? {
      "@type": "AggregateRating",
      "ratingValue": rating,
      "reviewCount": reviewCount
    } : undefined
  };

  return JSON.stringify(structuredData, null, 2);
}

// Set structured data in document head
export function setStructuredData(structuredData: string): void {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = structuredData;
  document.head.appendChild(script);
}

// Utility to create SEO-friendly slugs
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .trim();
}

// Generate canonical URL
export function setCanonicalUrl(path: string): void {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `${window.location.origin}${path}`);
}
