// XML Sitemap generation for SEO and Google crawling
import { allCities, allCategories, getCitySlug } from './all-categories';

export interface SitemapURL {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Generate all sitemap URLs
export function generateSitemapURLs(): SitemapURL[] {
  const baseUrl = window.location.origin;
  const urls: SitemapURL[] = [];
  const currentDate = new Date().toISOString().split('T')[0];

  // Main pages
  const mainPages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/business', priority: 0.9, changefreq: 'daily' as const },
    { path: '/all-categories', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/all-cities-categories', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/sitemap', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/plans', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/add-business', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/contact', priority: 0.7, changefreq: 'monthly' as const },
    { path: '/help', priority: 0.6, changefreq: 'monthly' as const },
    { path: '/privacy', priority: 0.5, changefreq: 'yearly' as const },
    { path: '/terms', priority: 0.5, changefreq: 'yearly' as const },
  ];

  mainPages.forEach(page => {
    urls.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  // Category-only pages
  allCategories.forEach(category => {
    urls.push({
      loc: `${baseUrl}/category/${category.slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  // City-only pages
  allCities.forEach(city => {
    const citySlug = getCitySlug(city);
    urls.push({
      loc: `${baseUrl}/business/${citySlug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  // City-category combination pages (highest priority for SEO)
  allCities.forEach(city => {
    const citySlug = getCitySlug(city);
    allCategories.forEach(category => {
      urls.push({
        loc: `${baseUrl}/business/${citySlug}/${category.slug}`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: 0.9
      });
    });
  });

  return urls;
}

// Generate XML sitemap string
export function generateXMLSitemap(): string {
  const urls = generateSitemapURLs();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  urls.forEach(url => {
    xml += '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    if (url.lastmod) {
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    }
    if (url.changefreq) {
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    }
    if (url.priority) {
      xml += `    <priority>${url.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  const baseUrl = window.location.origin;
  
  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1

# Allow specific bots full access
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /`;
}

// Set up automatic sitemap generation for SEO
export function setupSEOCrawling(): void {
  // Add robots meta tag to head if not exists
  if (!document.querySelector('meta[name="robots"]')) {
    const robotsMeta = document.createElement('meta');
    robotsMeta.setAttribute('name', 'robots');
    robotsMeta.setAttribute('content', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    document.head.appendChild(robotsMeta);
  }

  // Add Google Site Verification (placeholder - replace with actual verification code)
  if (!document.querySelector('meta[name="google-site-verification"]')) {
    const googleVerification = document.createElement('meta');
    googleVerification.setAttribute('name', 'google-site-verification');
    googleVerification.setAttribute('content', 'your-google-verification-code-here');
    document.head.appendChild(googleVerification);
  }

  // Add Bing Site Verification (placeholder - replace with actual verification code)
  if (!document.querySelector('meta[name="msvalidate.01"]')) {
    const bingVerification = document.createElement('meta');
    bingVerification.setAttribute('name', 'msvalidate.01');
    bingVerification.setAttribute('content', 'your-bing-verification-code-here');
    document.head.appendChild(bingVerification);
  }

  // Set geo meta tags for location-based service
  const geoMetas = [
    { name: 'geo.region', content: 'IN' },
    { name: 'geo.placename', content: 'India' },
    { name: 'geo.position', content: '20.5937;78.9629' }, // India center coordinates
    { name: 'ICBM', content: '20.5937, 78.9629' },
    { name: 'DC.title', content: 'VisaConsult India - Find Top Visa Consultants' }
  ];

  geoMetas.forEach(meta => {
    if (!document.querySelector(`meta[name="${meta.name}"]`)) {
      const metaTag = document.createElement('meta');
      metaTag.setAttribute('name', meta.name);
      metaTag.setAttribute('content', meta.content);
      document.head.appendChild(metaTag);
    }
  });
}

// Generate Google News sitemap for news-related content
export function generateNewsSitemap(): string {
  const baseUrl = window.location.origin;
  const currentDate = new Date().toISOString();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n';
  
  // Add news articles about visa policies, immigration updates, etc.
  const newsTopics = [
    'Immigration Policy Updates',
    'Visa Processing Changes',
    'Study Abroad News',
    'Work Permit Updates',
    'Immigration Law Changes'
  ];

  newsTopics.forEach((topic, index) => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/news/${topic.toLowerCase().replace(/\s+/g, '-')}</loc>\n`;
    xml += '    <news:news>\n';
    xml += '      <news:publication>\n';
    xml += '        <news:name>VisaConsult India</news:name>\n';
    xml += '        <news:language>en</news:language>\n';
    xml += '      </news:publication>\n';
    xml += '      <news:publication_date>' + currentDate + '</news:publication_date>\n';
    xml += `      <news:title>${topic} - VisaConsult India</news:title>\n`;
    xml += '    </news:news>\n';
    xml += '  </url>\n';
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Generate image sitemap for better image SEO
export function generateImageSitemap(): string {
  const baseUrl = window.location.origin;
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';
  
  // Add images for each city-category combination
  allCities.slice(0, 10).forEach(city => { // Limit to first 10 cities for performance
    allCategories.slice(0, 10).forEach(category => {
      const citySlug = getCitySlug(city);
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/business/${citySlug}/${category.slug}</loc>\n`;
      xml += '    <image:image>\n';
      xml += `      <image:loc>${baseUrl}/images/categories/${category.slug}.jpg</image:loc>\n`;
      xml += `      <image:title>${category.name} in ${city}</image:title>\n`;
      xml += `      <image:caption>Find top ${category.name.toLowerCase()} in ${city}</image:caption>\n`;
      xml += '    </image:image>\n';
      xml += '  </url>\n';
    });
  });
  
  xml += '</urlset>';
  
  return xml;
}

// Download sitemap as file
export function downloadSitemap(): void {
  const xmlContent = generateXMLSitemap();
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Download robots.txt as file
export function downloadRobotsTxt(): void {
  const robotsContent = generateRobotsTxt();
  const blob = new Blob([robotsContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'robots.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
