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
export function generateCityCategoryMeta(
  cityName: string,
  categoryName: string,
): MetaData {
  const isUAE = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain",
  ].includes(cityName);
  const country = isUAE ? "UAE" : "India";

  // Generate category-specific descriptions and keywords
  const categorySpecificInfo = getCategorySpecificContent(categoryName);

  return {
    title: `Top ${categoryName} In ${cityName} ${country} - VisaConsult India`,
    description: `Find the best ${categoryName.toLowerCase()} in ${cityName}, ${country}. ${categorySpecificInfo.description} Compare verified consultants, read authentic reviews, and get expert guidance. Professional ${categoryName.toLowerCase()} services with proven success rates in ${cityName}.`,
    keywords: `${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, ${categorySpecificInfo.keywords}, visa consultants ${cityName.toLowerCase()}, immigration services ${cityName.toLowerCase()}, best ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, top ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, ${categoryName.toLowerCase()} near me, ${categoryName.toLowerCase()} ${country}`,
    robots:
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    author: "VisaConsult India",
    viewport: "width=device-width, initial-scale=1.0",
  };
}

// Get category-specific content for better SEO
function getCategorySpecificContent(categoryName: string): {
  description: string;
  keywords: string;
} {
  const categoryLower = categoryName.toLowerCase();

  if (categoryLower.includes("immigration consultant")) {
    return {
      description:
        "Expert immigration lawyers and consultants for legal assistance, permanent residence applications, and citizenship guidance.",
      keywords:
        "immigration lawyer, pr application, citizenship consultant, legal immigration services, immigration documentation",
    };
  } else if (categoryLower.includes("visa consultant")) {
    return {
      description:
        "Professional visa consultants for all types of visa applications including tourist, business, student, and work visas.",
      keywords:
        "visa agent, visa processing, tourist visa, business visa, visa documentation, visa application services",
    };
  } else if (categoryLower.includes("study abroad")) {
    return {
      description:
        "Trusted study abroad consultants for international education guidance, university admissions, and student visa assistance.",
      keywords:
        "overseas education, university admission, student visa, education consultant, international studies, abroad admission",
    };
  } else if (
    categoryLower.includes("work permit") ||
    categoryLower.includes("work visa")
  ) {
    return {
      description:
        "Specialized consultants for work permits, employment visas, and job visa processing for international employment.",
      keywords:
        "work permit, employment visa, job visa, work authorization, employment permit, international job visa",
    };
  } else if (categoryLower.includes("canada")) {
    return {
      description:
        "Canada immigration specialists for Express Entry, Provincial Nominee Program, and Canadian permanent residence applications.",
      keywords:
        "canada pr, express entry, pnp program, canada immigration, canadian visa, maple leaf card",
    };
  } else if (categoryLower.includes("australia")) {
    return {
      description:
        "Australia immigration consultants for skilled migration, PR visas, and Australian work visa applications.",
      keywords:
        "australia pr, skilled migration, australian visa, 189 visa, 190 visa, australia immigration",
    };
  } else if (
    categoryLower.includes("usa") ||
    categoryLower.includes("america")
  ) {
    return {
      description:
        "USA visa consultants for H1B, L1, EB5, student visas, and American immigration services.",
      keywords:
        "usa visa, h1b visa, l1 visa, eb5 visa, america immigration, us visa consultant",
    };
  } else if (
    categoryLower.includes("uk") ||
    categoryLower.includes("britain")
  ) {
    return {
      description:
        "UK visa consultants for Tier 1, Tier 2, student visas, and British immigration services.",
      keywords:
        "uk visa, tier 1 visa, tier 2 visa, britain immigration, uk immigration consultant",
    };
  } else if (categoryLower.includes("europe")) {
    return {
      description:
        "European work visa specialists for Schengen visas, EU Blue Card, and European employment permits.",
      keywords:
        "europe visa, schengen visa, eu blue card, european work permit, europe immigration",
    };
  } else if (categoryLower.includes("germany")) {
    return {
      description:
        "Germany work permit and visa consultants for EU Blue Card, job seeker visa, and German immigration.",
      keywords:
        "germany visa, eu blue card, germany work permit, job seeker visa, german immigration",
    };
  } else if (categoryLower.includes("norway")) {
    return {
      description:
        "Norway work permit specialists for skilled worker visas and Norwegian immigration services.",
      keywords:
        "norway work permit, norway visa, norwegian immigration, skilled worker visa norway",
    };
  } else if (categoryLower.includes("family visa")) {
    return {
      description:
        "Family visa consultants for spouse visa, dependent visa, and family reunion immigration services.",
      keywords:
        "family visa, spouse visa, dependent visa, family reunion, family immigration",
    };
  } else if (
    categoryLower.includes("tourist") ||
    categoryLower.includes("visit")
  ) {
    return {
      description:
        "Tourist and visit visa services for leisure travel, family visits, and short-term stay visas.",
      keywords:
        "tourist visa, visit visa, travel visa, holiday visa, short term visa",
    };
  } else if (categoryLower.includes("business visa")) {
    return {
      description:
        "Business visa consultants for investor visas, business travel, and commercial visit permits.",
      keywords:
        "business visa, investor visa, commercial visa, business travel visa, entrepreneur visa",
    };
  } else if (categoryLower.includes("golden visa")) {
    return {
      description:
        "Golden visa and investor visa consultants for long-term residence through investment programs.",
      keywords:
        "golden visa, investor visa, investment visa, residence by investment, citizenship by investment",
    };
  }

  // Default fallback
  return {
    description:
      "Professional visa and immigration consultation services with expert guidance and documentation support.",
    keywords:
      "visa services, immigration services, documentation support, visa guidance, immigration consultant",
  };
}

// Generate meta data for category-only pages
export function generateCategoryMeta(
  categoryName: string,
  categoryDescription: string,
): MetaData {
  return {
    title: `Best ${categoryName} In India & UAE - VisaConsult India`,
    description: `Find the best ${categoryName.toLowerCase()} across India and UAE. Compare top-rated ${categoryName.toLowerCase()} in 100+ cities. ${categoryDescription} Professional visa consultation, immigration guidance, study abroad services, work permit assistance, and document support. Verified consultants with proven track record.`,
    keywords: `${categoryName.toLowerCase()}, best ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} india, ${categoryName.toLowerCase()} uae, visa consultants, immigration services, study abroad consultants, work permit agents, tourist visa services, pr consultants, immigration lawyers, visa processing, document attestation, embassy services, ${categoryName.toLowerCase().replace(/\s+/g, " ")}`,
    robots:
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    author: "VisaConsult India",
    viewport: "width=device-width, initial-scale=1.0",
  };
}

// Generate meta data for city-only pages
export function generateCityMeta(cityName: string): MetaData {
  const isUAE = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain",
  ].includes(cityName);
  const country = isUAE ? "UAE" : "India";

  return {
    title: `Top 10 Visa Consultants In ${cityName} - VisaConsult India`,
    description: `Find the top 10 visa consultants in ${cityName}, ${country}. Compare ratings, reviews, and services of verified immigration experts. Professional guidance for student visa, work visa, tourist visa, business visa, family visa, and permanent residence applications. Trusted consultants with proven success rates.`,
    keywords: `visa consultants ${cityName.toLowerCase()}, immigration consultants ${cityName.toLowerCase()}, best visa agents ${cityName.toLowerCase()}, visa services ${cityName.toLowerCase()}, study abroad consultants ${cityName.toLowerCase()}, work visa agents ${cityName.toLowerCase()}, tourist visa services ${cityName.toLowerCase()}, immigration lawyers ${cityName.toLowerCase()}, pr consultants ${cityName.toLowerCase()}, visa processing ${cityName.toLowerCase()}, document services ${cityName.toLowerCase()}, embassy services ${cityName.toLowerCase()}`,
    robots:
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    author: "VisaConsult India",
    viewport: "width=device-width, initial-scale=1.0",
  };
}

// Generate meta data for business profile pages
export function generateBusinessMeta(
  businessName: string,
  cityName: string,
  categoryName: string,
): MetaData {
  const isUAE = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain",
  ].includes(cityName);
  const country = isUAE ? "UAE" : "India";

  return {
    title: `${businessName} - ${categoryName} In ${cityName} | VisaConsult India`,
    description: `${businessName} is a trusted ${categoryName.toLowerCase()} in ${cityName}, ${country}. Read authentic reviews, check ratings, and get expert visa consultation services. Professional immigration guidance for study abroad, work permits, tourist visas, family visas, and permanent residence. Contact ${businessName} for reliable visa services.`,
    keywords: `${businessName}, ${categoryName.toLowerCase()} ${cityName.toLowerCase()}, visa consultants ${cityName.toLowerCase()}, immigration services ${cityName.toLowerCase()}, ${businessName.toLowerCase().replace(/\s+/g, " ")}, visa agents, immigration lawyers, study abroad consultants, work permit services, tourist visa, pr consultants`,
    robots:
      "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    author: "VisaConsult India",
    viewport: "width=device-width, initial-scale=1.0",
  };
}

// Apply meta data to document
export function setPageMeta(metaData: MetaData): void {
  // Set title
  document.title = metaData.title;

  // Set meta description
  setMetaTag("description", metaData.description);

  // Set meta keywords
  setMetaTag("keywords", metaData.keywords);

  // Set meta robots
  if (metaData.robots) {
    setMetaTag("robots", metaData.robots);
  }

  // Set meta author
  if (metaData.author) {
    setMetaTag("author", metaData.author);
  }

  // Set meta viewport
  if (metaData.viewport) {
    setMetaTag("viewport", metaData.viewport);
  }

  // Set additional SEO meta tags
  setMetaTag("language", "English");
  setMetaTag("revisit-after", "7 days");
  setMetaTag("distribution", "global");
  setMetaTag("rating", "general");
  setMetaTag("HandheldFriendly", "True");
  setMetaTag("MobileOptimized", "320");

  // Set Open Graph meta tags
  setOpenGraphMeta(metaData);

  // Set schema.org structured data
  setWebsiteStructuredData();
}

// Helper function to set meta tags
function setMetaTag(name: string, content: string): void {
  let metaTag = document.querySelector(`meta[name="${name}"]`);
  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute("name", name);
    document.head.appendChild(metaTag);
  }
  metaTag.setAttribute("content", content);
}

// Set Open Graph meta tags for social media sharing
function setOpenGraphMeta(metaData: MetaData): void {
  const currentUrl = window.location.href;
  const ogTags = [
    { property: "og:title", content: metaData.title },
    { property: "og:description", content: metaData.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: currentUrl },
    { property: "og:site_name", content: "VisaConsult India" },
    { property: "og:locale", content: "en_IN" },
    { property: "og:image", content: `${window.location.origin}/og-image.jpg` },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    { property: "og:image:alt", content: metaData.title },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@VisaConsultIndia" },
    { name: "twitter:creator", content: "@VisaConsultIndia" },
    { name: "twitter:title", content: metaData.title },
    { name: "twitter:description", content: metaData.description },
    {
      name: "twitter:image",
      content: `${window.location.origin}/og-image.jpg`,
    },
    { name: "twitter:image:alt", content: metaData.title },
  ];

  ogTags.forEach((tag) => {
    const property = tag.property || tag.name;
    const attribute = tag.property ? "property" : "name";

    let metaTag = document.querySelector(`meta[${attribute}="${property}"]`);
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute(attribute, property);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", tag.content);
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
  reviewCount?: number,
): string {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: businessName,
    description: `${categoryName} in ${cityName}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: "IN",
    },
    telephone: phone,
    url: window.location.href,
    category: categoryName,
    aggregateRating:
      rating && reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviewCount,
          }
        : undefined,
  };

  return JSON.stringify(structuredData, null, 2);
}

// Set structured data in document head
export function setStructuredData(structuredData: string): void {
  // Remove existing structured data
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]',
  );
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = structuredData;
  document.head.appendChild(script);
}

// Utility to create SEO-friendly slugs
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove multiple hyphens
    .trim();
}

// Set SEO link tags for Google crawling optimization
export function setSEOLinks(links: SEOLinks): void {
  // Set canonical URL
  if (links.canonical) {
    setLinkTag("canonical", links.canonical);
  }

  // Set prev/next for pagination
  if (links.prev) {
    setLinkTag("prev", links.prev);
  }

  if (links.next) {
    setLinkTag("next", links.next);
  }

  // Set alternate languages
  if (links.alternate) {
    // Remove existing alternate links
    document
      .querySelectorAll('link[rel="alternate"]')
      .forEach((link) => link.remove());

    links.alternate.forEach((href) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", "en-IN");
      link.setAttribute("href", href);
      document.head.appendChild(link);
    });
  }

  // Add hreflang for current page
  setLinkTag("alternate", window.location.href, { hreflang: "en-IN" });
  setLinkTag("alternate", window.location.href, { hreflang: "x-default" });
}

// Helper function to set link tags
function setLinkTag(
  rel: string,
  href: string,
  attributes?: Record<string, string>,
): void {
  let existingLink = document.querySelector(`link[rel="${rel}"]`);
  if (existingLink && rel === "canonical") {
    existingLink.remove();
  }

  const link = document.createElement("link");
  link.setAttribute("rel", rel);
  link.setAttribute(
    "href",
    href.startsWith("http") ? href : `${window.location.origin}${href}`,
  );

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
    name: "VisaConsult India",
    url: window.location.origin,
    description:
      "Find top-rated visa consultants and immigration experts across India and UAE. Compare services, read reviews, and get expert guidance for study abroad, work permits, tourist visas, and permanent residence applications.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${window.location.origin}/business?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "VisaConsult India",
      url: window.location.origin,
    },
  };

  setStructuredData(JSON.stringify(structuredData, null, 2));
}

// Generate breadcrumb structured data
export function setBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>,
): void {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${window.location.origin}${item.url}`,
    })),
  };

  // Add to existing structured data or create new
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]',
  );
  if (existingScript) {
    try {
      const existingData = JSON.parse(existingScript.textContent || "{}");
      const combinedData = Array.isArray(existingData)
        ? [...existingData, structuredData]
        : [existingData, structuredData];
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
  categoryDescription: string,
): void {
  const isUAE = [
    "Dubai",
    "Abu Dhabi",
    "Sharjah",
    "Ajman",
    "Ras Al Khaimah",
    "Fujairah",
    "Umm Al Quwain",
    "Al Ain",
  ].includes(cityName);
  const country = isUAE ? "AE" : "IN";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${categoryName} in ${cityName}`,
    description: categoryDescription,
    provider: {
      "@type": "Organization",
      name: "VisaConsult India",
      url: window.location.origin,
    },
    areaServed: {
      "@type": "City",
      name: cityName,
      addressCountry: country,
    },
    serviceType: categoryName,
    url: window.location.href,
  };

  setStructuredData(JSON.stringify(structuredData, null, 2));
}
