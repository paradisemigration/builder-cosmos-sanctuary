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

// Generate meta data for city-category pages with enhanced SEO
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
  const websiteName = "VisaConsult India";

  // Generate category-specific descriptions and keywords
  const categorySpecificInfo = getCategorySpecificContent(categoryName);

  // Format: "Most Trusted + category Name + in + city name | Website Name"
  const title = `Most Trusted ${categoryName} in ${cityName} | ${websiteName}`;

  // 200-character optimized description
  const description = `Find the most trusted ${categoryName.toLowerCase()} in ${cityName}, ${country}. ${categorySpecificInfo.shortDesc} Compare verified consultants with proven success rates.`;

  // 20 relevant keywords optimized for the title and content
  const keywordsList = [
    `most trusted ${categoryName.toLowerCase()}`,
    `${categoryName.toLowerCase()} ${cityName.toLowerCase()}`,
    `best ${categoryName.toLowerCase()} ${cityName.toLowerCase()}`,
    `top ${categoryName.toLowerCase()} ${cityName.toLowerCase()}`,
    `verified ${categoryName.toLowerCase()} ${cityName.toLowerCase()}`,
    `${categoryName.toLowerCase()} near me`,
    `${categoryName.toLowerCase()} services ${cityName.toLowerCase()}`,
    `professional ${categoryName.toLowerCase()} ${cityName.toLowerCase()}`,
    `trusted ${categoryName.toLowerCase()} agent ${cityName.toLowerCase()}`,
    `${categoryName.toLowerCase()} consultant ${cityName.toLowerCase()}`,
    ...categorySpecificInfo.keywords.split(', ').slice(0, 10)
  ];

  return {
    title,
    description,
    keywords: keywordsList.join(', '),
    canonical: `${typeof window !== 'undefined' ? window.location.origin : ''}/business/${cityName.toLowerCase().replace(/\s+/g, '-')}/${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    author: websiteName,
    viewport: "width=device-width, initial-scale=1.0",
  };
}

// Get category-specific content for better SEO with short descriptions
function getCategorySpecificContent(categoryName: string): {
  shortDesc: string;
  keywords: string;
} {
  const categoryLower = categoryName.toLowerCase();

  if (categoryLower.includes("immigration consultant")) {
    return {
      shortDesc: "Expert immigration lawyers for PR applications & citizenship guidance.",
      keywords: "immigration lawyer, pr application, citizenship consultant, legal immigration services, immigration documentation, immigration attorney, permanent residence, immigration advisor, immigration expert, visa lawyer",
    };
  } else if (categoryLower.includes("visa consultant")) {
    return {
      shortDesc: "Professional visa consultants for tourist, business, student & work visas.",
      keywords: "visa agent, visa processing, tourist visa, business visa, visa documentation, visa application services, visa advisor, visa expert, visa agency, visa assistance",
    };
  } else if (categoryLower.includes("study abroad")) {
    return {
      shortDesc: "Trusted study abroad consultants for international education & admissions.",
      keywords: "overseas education, university admission, student visa, education consultant, international studies, abroad admission, study overseas, foreign education, university counselor, academic advisor",
    };
  } else if (categoryLower.includes("work permit") || categoryLower.includes("work visa")) {
    return {
      shortDesc: "Specialized consultants for work permits & employment visas worldwide.",
      keywords: "work permit, employment visa, job visa, work authorization, employment permit, international job visa, work visa consultant, employment authorization, skilled worker visa, temporary work permit",
    };
  } else if (categoryLower.includes("canada")) {
    return {
      shortDesc: "Canada immigration specialists for Express Entry & PR applications.",
      keywords: "canada pr, express entry, pnp program, canada immigration, canadian visa, maple leaf card, canada permanent residence, canadian work permit, canada student visa, quebec immigration",
    };
  } else if (categoryLower.includes("australia")) {
    return {
      shortDesc: "Australia immigration consultants for skilled migration & PR visas.",
      keywords: "australia pr, skilled migration, australian visa, 189 visa, 190 visa, australia immigration, subclass 189, subclass 190, australia work visa, aussie immigration",
    };
  } else if (categoryLower.includes("usa") || categoryLower.includes("america")) {
    return {
      shortDesc: "USA visa consultants for H1B, L1, EB5 & student visas.",
      keywords: "usa visa, h1b visa, l1 visa, eb5 visa, america immigration, us visa consultant, green card, f1 visa, us work permit, american visa",
    };
  } else if (categoryLower.includes("uk") || categoryLower.includes("britain")) {
    return {
      shortDesc: "UK visa consultants for Tier 1, Tier 2 & student visas.",
      keywords: "uk visa, tier 1 visa, tier 2 visa, britain immigration, uk immigration consultant, british visa, uk work permit, uk student visa, tier 4 visa, uk spouse visa",
    };
  } else if (categoryLower.includes("europe")) {
    return {
      shortDesc: "European work visa specialists for Schengen & EU Blue Card.",
      keywords: "europe visa, schengen visa, eu blue card, european work permit, europe immigration, schengen countries, european union visa, eu visa, european work visa, eu immigration",
    };
  } else if (categoryLower.includes("germany")) {
    return {
      shortDesc: "Germany work permit consultants for EU Blue Card & job seeker visa.",
      keywords: "germany visa, eu blue card, germany work permit, job seeker visa, german immigration, germany work visa, german residence permit, germany student visa, berlin visa, munich visa",
    };
  } else if (categoryLower.includes("norway")) {
    return {
      shortDesc: "Norway work permit specialists for skilled worker visas.",
      keywords: "norway work permit, norway visa, norwegian immigration, skilled worker visa norway, norway job visa, oslo visa, norway pr, scandinavia visa, nordic visa, norway student visa",
    };
  } else if (categoryLower.includes("family visa")) {
    return {
      shortDesc: "Family visa consultants for spouse, dependent & family reunion visas.",
      keywords: "family visa, spouse visa, dependent visa, family reunion, family immigration, partner visa, marriage visa, child visa, parent visa, family permit",
    };
  } else if (categoryLower.includes("tourist") || categoryLower.includes("visit")) {
    return {
      shortDesc: "Tourist & visit visa services for leisure travel & family visits.",
      keywords: "tourist visa, visit visa, travel visa, holiday visa, short term visa, vacation visa, leisure visa, family visit visa, tourist permit, travel permit",
    };
  } else if (categoryLower.includes("business visa")) {
    return {
      shortDesc: "Business visa consultants for investor & commercial travel visas.",
      keywords: "business visa, investor visa, commercial visa, business travel visa, entrepreneur visa, business permit, investor permit, commercial travel, business trip visa, corporate visa",
    };
  } else if (categoryLower.includes("golden visa")) {
    return {
      shortDesc: "Golden visa consultants for long-term residence through investment.",
      keywords: "golden visa, investor visa, investment visa, residence by investment, citizenship by investment, long term visa, investment immigration, investor residence, golden passport, wealth visa",
    };
  } else if (categoryLower.includes("student") || categoryLower.includes("education")) {
    return {
      shortDesc: "Student visa & education consultants for international studies.",
      keywords: "student visa, education consultant, study visa, academic visa, university admission, college admission, international education, student permit, education advisor, academic counselor",
    };
  }

  // Default fallback
  return {
    shortDesc: "Professional visa & immigration consultation services with expert guidance.",
    keywords: "visa services, immigration services, documentation support, visa guidance, immigration consultant, visa advisor, immigration expert, visa agent, visa processing, immigration assistance",
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

// Generate meta data for city-only pages with comprehensive SEO
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
  const websiteName = "VisaConsult India";

  // Format: "Top 10 Visa & Immigration Consultants in + city Name | Website name"
  const title = `Top 10 Visa & Immigration Consultants in ${cityName} | ${websiteName}`;

  // 200-character optimized description
  const description = `Find top 10 visa & immigration consultants in ${cityName}, ${country}. Compare verified experts for student, work, tourist & PR visas. Best immigration services guaranteed.`;

  // 20 relevant keywords for city-only pages
  const keywordsList = [
    `top 10 visa consultants ${cityName.toLowerCase()}`,
    `best immigration consultants ${cityName.toLowerCase()}`,
    `visa & immigration consultants ${cityName.toLowerCase()}`,
    `visa agents ${cityName.toLowerCase()}`,
    `immigration services ${cityName.toLowerCase()}`,
    `study abroad consultants ${cityName.toLowerCase()}`,
    `work visa consultants ${cityName.toLowerCase()}`,
    `tourist visa services ${cityName.toLowerCase()}`,
    `pr consultants ${cityName.toLowerCase()}`,
    `immigration lawyers ${cityName.toLowerCase()}`,
    `visa processing ${cityName.toLowerCase()}`,
    `student visa ${cityName.toLowerCase()}`,
    `work permit ${cityName.toLowerCase()}`,
    `family visa ${cityName.toLowerCase()}`,
    `business visa ${cityName.toLowerCase()}`,
    `document attestation ${cityName.toLowerCase()}`,
    `embassy services ${cityName.toLowerCase()}`,
    `visa consultation ${cityName.toLowerCase()}`,
    `immigration guidance ${cityName.toLowerCase()}`,
    `visa documentation ${cityName.toLowerCase()}`
  ];

  return {
    title,
    description,
    keywords: keywordsList.join(', '),
    canonical: `${typeof window !== 'undefined' ? window.location.origin : ''}/business/${cityName.toLowerCase().replace(/\s+/g, '-')}`,
    robots: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    author: websiteName,
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

  // Set additional SEO meta tags for faster Google crawling
  setMetaTag("language", "English");
  setMetaTag("revisit-after", "3 days");
  setMetaTag("distribution", "global");
  setMetaTag("rating", "general");
  setMetaTag("HandheldFriendly", "True");
  setMetaTag("MobileOptimized", "320");
  setMetaTag("apple-mobile-web-app-capable", "yes");
  setMetaTag("apple-mobile-web-app-status-bar-style", "black-translucent");
  setMetaTag("format-detection", "telephone=no");
  setMetaTag("theme-color", "#ffffff");
  setMetaTag("msapplication-TileColor", "#ffffff");
  setMetaTag("application-name", "VisaConsult India");
  setMetaTag("msapplication-tooltip", metaData.description);
  setMetaTag("geo.region", "IN");
  setMetaTag("geo.placename", "India");
  setMetaTag("ICBM", "20.5937, 78.9629");
  setMetaTag("DC.title", metaData.title);
  setMetaTag("DC.creator", "VisaConsult India");
  setMetaTag("DC.subject", metaData.keywords);
  setMetaTag("DC.description", metaData.description);
  setMetaTag("DC.publisher", "VisaConsult India");
  setMetaTag("DC.contributor", "VisaConsult India");
  setMetaTag("DC.date", new Date().toISOString().split('T')[0]);
  setMetaTag("DC.type", "Text");
  setMetaTag("DC.format", "text/html");
  setMetaTag("DC.identifier", window.location.href);
  setMetaTag("DC.language", "en");
  setMetaTag("DC.coverage", "IN");
  setMetaTag("DC.rights", "© 2024 VisaConsult India. All rights reserved.");

  // Additional crawling and indexing hints
  setMetaTag("googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
  setMetaTag("bingbot", "index, follow");
  setMetaTag("slurp", "index, follow");
  setMetaTag("duckduckbot", "index, follow");
  setMetaTag("facebookexternalhit", "index, follow");
  setMetaTag("twitterbot", "index, follow");

  // Set Open Graph meta tags
  setOpenGraphMeta(metaData);

  // Set schema.org structured data
  setWebsiteStructuredData();

  // Set appropriate structured data based on page type
  if (metaData.title.includes("Most Trusted") && metaData.title.includes(" in ")) {
    // City + Category page schema
    setCityBusinessDirectoryStructuredData(metaData);
  } else if (metaData.title.includes("Top 10 Visa & Immigration Consultants in")) {
    // City-only page schema
    setCityPageStructuredData(metaData);
  }
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

// Set city business directory structured data
function setCityBusinessDirectoryStructuredData(metaData: MetaData): void {
  const currentUrl = window.location.href;
  const pathParts = window.location.pathname.split('/');
  const cityName = pathParts[2]?.replace(/-/g, ' ');
  const categoryName = pathParts[3]?.replace(/-/g, ' ');

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": metaData.title,
    "description": metaData.description,
    "url": currentUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "VisaConsult India",
      "url": window.location.origin
    },
    "about": {
      "@type": "LocalBusiness",
      "serviceType": categoryName,
      "areaServed": {
        "@type": "City",
        "name": cityName,
        "addressCountry": "IN"
      }
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Business Directory",
          "item": `${window.location.origin}/business`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": cityName,
          "item": `${window.location.origin}/business/${pathParts[2]}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": categoryName,
          "item": currentUrl
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `${categoryName} in ${cityName}`,
      "description": `Directory of ${categoryName} in ${cityName}`,
      "numberOfItems": "10+"
    }
  };

  let script = document.querySelector('script[type="application/ld+json"][data-type="directory"]');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-type', 'directory');
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(structuredData);
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
