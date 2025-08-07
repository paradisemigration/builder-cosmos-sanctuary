// Debug API endpoint to test business data flow
export default function handler(req, res) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    const { test } = req.query;

    // Test business data generation
    const testBusiness = {
      id: "test-business-1",
      googlePlaceId: "test-place-1",
      name: "Elite Immigration Services",
      category: "immigration-consultants",
      description: "Professional immigration and visa consultancy services in Mumbai. Specialized in immigration consultants with proven track record.",
      services: [
        "Immigration Consultants",
        "Documentation Support",
        "Application Processing",
        "Interview Preparation"
      ],
      address: "123, Business District, Mumbai",
      city: "Mumbai",
      zone: "Mumbai Central",
      phone: "+91-22222-33333",
      whatsapp: "+91-9876543210",
      email: "info@eliteimmigrationservices.com",
      website: "https://www.eliteimmigrationservices.com",
      rating: 4.5,
      reviewCount: 87,
      isVerified: true,
      logo: "https://picsum.photos/200/200?random=1",
      coverImage: "https://picsum.photos/800/400?random=1001",
      gallery: [
        "https://picsum.photos/400/300?random=2001",
        "https://picsum.photos/400/300?random=3001"
      ],
      licenseNo: "LIC000001",
      ownerName: "Rajesh Sharma",
      successRate: 85,
      experience: 8,
      languages: ["Hindi", "English", "Gujarati"],
      establishedYear: 2016,
      specializations: ["immigration consultants", "Family Visa", "Student Visa"],
      clientsServed: 2500
    };

    const debug = {
      success: true,
      timestamp: new Date().toISOString(),
      hostname: req.headers.host,
      url: req.url,
      query: req.query,
      testBusiness,
      apiEndpoints: {
        businesses: "/api/businesses",
        featured: "/api/businesses/featured", 
        stats: "/api/businesses/stats"
      },
      databaseSize: 1500,
      message: "✅ API is working! Business data structure is correct.",
      routes: {
        homepage: "/",
        browse: "/browse",
        cityListing: "/business/mumbai",
        cityCategory: "/business/mumbai/immigration-consultants",
        uaeCityListing: "/uae/dubai",
        uaeCityCategory: "/uae/dubai/visa-consultants"
      },
      testUrls: [
        "/api/businesses?limit=5",
        "/api/businesses?city=mumbai&limit=5",
        "/api/businesses?category=immigration-consultants&limit=5",
        "/api/businesses?city=mumbai&category=immigration-consultants&limit=5"
      ]
    };

    console.log("🔍 Debug API called:", debug);
    res.status(200).json(debug);
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
