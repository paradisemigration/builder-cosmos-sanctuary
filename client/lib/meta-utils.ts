// Meta utility functions for consistent SEO across all pages

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  canonical?: string;
  robots?: string;
  author?: string;
  viewport?: string;
}

export interface SEOLinks {
  canonical?: string;
  prev?: string;
  next?: string;
  alternate?: string[];
}

// Generate meta data for city-category pages
export function generateCityCategoryMeta(cityName: string, categoryName: string): MetaData {
  const isUAE = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'].includes(cityName);
  const country = isUAE ? 'UAE' : 'India';

  return {
    title: `Top 10 ${categoryName} In ${cityName} - VisaConsult India`,
    description: `Find the top 10 ${categoryName.toLowerCase()} in ${cityName}, ${country}. Compare ratings, reviews, and services of verified ${categoryName.toLowerCase()}. Expert visa consultation, immigration services, and documentation support. Get professional guidance for study abroad, work permits, tourist visas, and permanent residence applications.`,
    keywords: `${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} in ${cityName.toLowerCase()}, visa consultants ${cityName.toLowerCase()}, immigration services ${cityName.toLowerCase()}, ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, best ${categoryName.toLowerCase()}, top ${categoryName.toLowerCase()}, visa agents ${cityName.toLowerCase()}, immigration lawyers ${cityName.toLowerCase()}, study abroad consultants ${cityName.toLowerCase()}, work permit services ${cityName.toLowerCase()}, tourist visa ${cityName.toLowerCase()}, pr consultants ${cityName.toLowerCase()}`,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'VisaConsult India',
    viewport: 'width=device-width, initial-scale=1.0'
  };
}

// Generate meta data for category-only pages
export function generateCategoryMeta(categoryName: string, categoryDescription: string): MetaData {
  return {
    title: `Best ${categoryName} In India & UAE - VisaConsult India`,
    description: `Find the best ${categoryName.toLowerCase()} across India and UAE. Compare top-rated ${categoryName.toLowerCase()} in 100+ cities. ${categoryDescription} Professional visa consultation, immigration guidance, study abroad services, work permit assistance, and document support. Verified consultants with proven track record.`,
    keywords: `${categoryName.toLowerCase()}, best ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} india, ${categoryName.toLowerCase()} uae, visa consultants, immigration services, study abroad consultants, work permit agents, tourist visa services, pr consultants, immigration lawyers, visa processing, document attestation, embassy services, ${categoryName.toLowerCase().replace(/\s+/g, ' ')}`,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'VisaConsult India',
    viewport: 'width=device-width, initial-scale=1.0'
  };
}

// Generate meta data for city-only pages
export function generateCityMeta(cityName: string): MetaData {
  const isUAE = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'].includes(cityName);
  const country = isUAE ? 'UAE' : 'India';

  return {
    title: `Top 10 Visa Consultants In ${cityName} - VisaConsult India`,
    description: `Find the top 10 visa consultants in ${cityName}, ${country}. Compare ratings, reviews, and services of verified immigration experts. Professional guidance for student visa, work visa, tourist visa, business visa, family visa, and permanent residence applications. Trusted consultants with proven success rates.`,
    keywords: `visa consultants ${cityName.toLowerCase()}, immigration consultants ${cityName.toLowerCase()}, best visa agents ${cityName.toLowerCase()}, visa services ${cityName.toLowerCase()}, study abroad consultants ${cityName.toLowerCase()}, work visa agents ${cityName.toLowerCase()}, tourist visa services ${cityName.toLowerCase()}, immigration lawyers ${cityName.toLowerCase()}, pr consultants ${cityName.toLowerCase()}, visa processing ${cityName.toLowerCase()}, document services ${cityName.toLowerCase()}, embassy services ${cityName.toLowerCase()}`,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'VisaConsult India',
    viewport: 'width=device-width, initial-scale=1.0'
  };
}

// Generate meta data for business profile pages
export function generateBusinessMeta(businessName: string, cityName: string, categoryName: string): MetaData {
  const isUAE = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'].includes(cityName);
  const country = isUAE ? 'UAE' : 'India';

  return {
    title: `${businessName} - ${categoryName} In ${cityName} | VisaConsult India`,
    description: `${businessName} is a trusted ${categoryName.toLowerCase()} in ${cityName}, ${country}. Read authentic reviews, check ratings, and get expert visa consultation services. Professional immigration guidance for study abroad, work permits, tourist visas, family visas, and permanent residence. Contact ${businessName} for reliable visa services.`,
    keywords: `${businessName}, ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, visa consultants ${cityName.toLowerCase()}, immigration services ${cityName.toLowerCase()}, ${businessName.toLowerCase().replace(/\s+/g, ' ')}, visa agents, immigration lawyers, study abroad consultants, work permit services, tourist visa, pr consultants`,
    robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    author: 'VisaConsult India',
    viewport: 'width=device-width, initial-scale=1.0'
  };
}

// Apply meta data to document
export function setPageMeta(metaData: MetaData): void {
  // Set title
  document.title = metaData.title;

  // Set meta description
  setMetaTag('description', metaData.description);

  // Set meta keywords
  setMetaTag('keywords', metaData.keywords);

  // Set meta robots
  if (metaData.robots) {
    setMetaTag('robots', metaData.robots);
  }

  // Set meta author
  if (metaData.author) {
    setMetaTag('author', metaData.author);
  }

  // Set meta viewport
  if (metaData.viewport) {
    setMetaTag('viewport', metaData.viewport);
  }

  // Set additional SEO meta tags
  setMetaTag('language', 'English');
  setMetaTag('revisit-after', '7 days');
  setMetaTag('distribution', 'global');
  setMetaTag('rating', 'general');
  setMetaTag('HandheldFriendly', 'True');
  setMetaTag('MobileOptimized', '320');

  // Set Open Graph meta tags
  setOpenGraphMeta(metaData);

  // Set schema.org structured data
  setWebsiteStructuredData();
}

// Helper function to set meta tags
function setMetaTag(name: string, content: string): void {
  let metaTag = document.querySelector(`meta[name="${name}"]`);
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', name);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute('content', content);
}

// Set Open Graph meta tags for social media sharing
function setOpenGraphMeta(metaData: MetaData): void {
  const currentUrl = window.location.href;
  const ogTags = [
    { property: 'og:title', content: metaData.title },
    { property: 'og:description', content: metaData.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: currentUrl },
    { property: 'og:site_name', content: 'VisaConsult India' },
    { property: 'og:locale', content: 'en_IN' },
    { property: 'og:image', content: `${window.location.origin}/og-image.jpg` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: metaData.title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@VisaConsultIndia' },
    { name: 'twitter:creator', content: '@VisaConsultIndia' },
    { name: 'twitter:title', content: metaData.title },
    { name: 'twitter:description', content: metaData.description },
    { name: 'twitter:image', content: `${window.location.origin}/og-image.jpg` },
    { name: 'twitter:image:alt', content: metaData.title },
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

// Set SEO link tags for Google crawling optimization
export function setSEOLinks(links: SEOLinks): void {
  // Set canonical URL
  if (links.canonical) {
    setLinkTag('canonical', links.canonical);
  }

  // Set prev/next for pagination
  if (links.prev) {
    setLinkTag('prev', links.prev);
  }

  if (links.next) {
    setLinkTag('next', links.next);
  }

  // Set alternate languages
  if (links.alternate) {
    // Remove existing alternate links
    document.querySelectorAll('link[rel="alternate"]').forEach(link => link.remove());

    links.alternate.forEach(href => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', 'en-IN');
      link.setAttribute('href', href);
      document.head.appendChild(link);
    });
  }

  // Add hreflang for current page
  setLinkTag('alternate', window.location.href, { hreflang: 'en-IN' });
  setLinkTag('alternate', window.location.href, { hreflang: 'x-default' });
}

// Helper function to set link tags
function setLinkTag(rel: string, href: string, attributes?: Record<string, string>): void {
  let existingLink = document.querySelector(`link[rel="${rel}"]`);
  if (existingLink && rel === 'canonical') {
    existingLink.remove();
  }

  const link = document.createElement('link');
  link.setAttribute('rel', rel);
  link.setAttribute('href', href.startsWith('http') ? href : `${window.location.origin}${href}`);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      link.setAttribute(key, value);
    });
  }

  document.head.appendChild(link);
}

// Generate canonical URL (legacy function for compatibility)
export function setCanonicalUrl(path: string): void {
  setSEOLinks({ canonical: path });
}

// Set website structured data for better Google understanding
function setWebsiteStructuredData(): void {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VisaConsult India",
    "url": window.location.origin,
    "description": "Find top-rated visa consultants and immigration experts across India and UAE. Compare services, read reviews, and get expert guidance for study abroad, work permits, tourist visas, and permanent residence applications.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/business?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "VisaConsult India",
      "url": window.location.origin
    }
  };

  setStructuredData(JSON.stringify(structuredData, null, 2));
}

// Generate breadcrumb structured data
export function setBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>): void {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${window.location.origin}${item.url}`
    }))
  };

  // Add to existing structured data or create new
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    try {
      const existingData = JSON.parse(existingScript.textContent || '{}');
      const combinedData = Array.isArray(existingData) ? [...existingData, structuredData] : [existingData, structuredData];
      existingScript.textContent = JSON.stringify(combinedData, null, 2);
    } catch {
      // If parsing fails, replace with new data
      existingScript.textContent = JSON.stringify([structuredData], null, 2);
    }
  } else {
    setStructuredData(JSON.stringify(structuredData, null, 2));
  }
}

// Generate local business structured data for city-category pages
export function setCityServiceStructuredData(
  cityName: string,
  categoryName: string,
  categoryDescription: string
): void {
  const isUAE = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain', 'Al Ain'].includes(cityName);
  const country = isUAE ? 'AE' : 'IN';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": `${categoryName} in ${cityName}`,
    "description": categoryDescription,
    "provider": {
      "@type": "Organization",
      "name": "VisaConsult India",
      "url": window.location.origin
    },
    "areaServed": {
      "@type": "City",
      "name": cityName,
      "addressCountry": country
    },
    "serviceType": categoryName,
    "url": window.location.href
  };

  setStructuredData(JSON.stringify(structuredData, null, 2));
}
