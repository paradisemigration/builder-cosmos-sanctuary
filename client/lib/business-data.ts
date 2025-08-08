// Comprehensive business data for immediate frontend functionality
// This provides 1500+ businesses until backend is fully configured

export function generateBusinessData() {
  const indianCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Surat",
    "Lucknow",
    "Kanpur",
    "Nagpur",
    "Patna",
    "Indore",
    "Thane",
    "Bhopal",
    "Visakhapatnam",
    "Vadodara",
    "Firozabad",
    "Ludhiana",
    "Rajkot",
    "Agra",
    "Siliguri",
    "Nashik",
    "Faridabad",
    "Patiala",
    "Ghaziabad",
    "Kalyan",
    "Dombivli",
    "Howrah",
    "Ranchi",
    "Barrackpore",
    "Kharagpur",
    "Durgapur",
    "Asansol",
    "Rourkela",
    "Nanded",
    "Kolhapur",
    "Ajmer",
    "Akola",
    "Gulbarga",
    "Jamnagar",
    "Ujjain",
    "Loni",
    "Sikar",
    "Jhansi",
    "Ulhasnagar",
    "Jammu",
    "Sangli",
    "Amritsar",
    "Allahabad",
    "Bareilly",
  ];

  const categories = [
    "immigration-consultants",
    "study-abroad-consultants",
    "visa-consultants",
    "work-visa-consultants",
    "tourist-visa-services",
    "student-visa-consultants",
    "visit-visa-specialists",
    "business-visa-services",
    "express-visa-services",
    "pr-citizenship-services",
    "overseas-education",
    "education-consultants",
  ];

  const companyPrefixes = [
    "Global",
    "Prime",
    "Elite",
    "Expert",
    "Professional",
    "Trusted",
    "Reliable",
    "Premium",
    "Superior",
    "Excellence",
    "Success",
    "Secure",
    "Swift",
    "Smart",
    "Royal",
    "Imperial",
    "International",
    "Universal",
    "Platinum",
    "Diamond",
    "Apex",
    "Crown",
    "Golden",
    "Silver",
    "Mega",
    "Ultra",
    "Super",
    "Pioneer",
  ];

  const companySuffixes = [
    "Immigration Services",
    "Visa Consultancy",
    "Global Solutions",
    "Consulting",
    "Immigration Experts",
    "Visa Services",
    "International Consultants",
    "Migration Services",
    "Overseas Consultancy",
    "Visa Solutions",
    "Immigration Hub",
    "Global Consultants",
    "Visa Experts",
    "International Services",
    "Migration Experts",
    "Education Consultants",
    "Study Abroad Services",
    "Career Consultants",
  ];

  const businesses = [];

  for (let i = 0; i < 1500; i++) {
    const prefix = companyPrefixes[i % companyPrefixes.length];
    const suffix = companySuffixes[i % companySuffixes.length];
    const city = indianCities[i % indianCities.length];
    const category = categories[i % categories.length];

    businesses.push({
      id: `business-${i + 1}`,
      googlePlaceId: `real-place-${i + 1}`,
      name: `${prefix} ${suffix}`,
      category,
      description: `Professional immigration and visa consultancy services in ${city}. Specialized in ${category.replace("-", " ")} with proven track record. Over ${Math.floor(Math.random() * 15) + 5} years of experience serving clients.`,
      services: [
        category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        "Documentation Support",
        "Application Processing",
        "Interview Preparation",
        "Visa Application Review",
        "Legal Compliance Check",
      ],
      address: `${Math.floor(Math.random() * 999) + 1}, Business District, ${city}`,
      city,
      zone: `${city} Central`,
      phone: `+91-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 90000) + 10000}`,
      whatsapp: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `info@${prefix.toLowerCase()}${suffix.toLowerCase().replace(/\s+/g, "")}.com`,
      website: `https://www.${prefix.toLowerCase()}${suffix.toLowerCase().replace(/\s+/g, "")}.com`,
      rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5 - 5.0
      reviewCount: Math.floor(Math.random() * 150) + 25, // 25-175 reviews
      isVerified: Math.random() > 0.05, // 95% verified
      isFeatured: i < 50, // First 50 businesses are featured
      logo: `https://picsum.photos/200/200?random=${i + 100}`,
      coverImage: `https://picsum.photos/800/400?random=${i + 1000}`,
      gallery: [
        `https://picsum.photos/400/300?random=${i + 2000}`,
        `https://picsum.photos/400/300?random=${i + 3000}`,
      ],
      licenseNo: `LIC${String(i + 1).padStart(6, "0")}`,
      ownerName: `${["Rajesh", "Priya", "Amit", "Sunita", "Vikash", "Meera", "Ravi", "Kavita"][i % 8]} ${["Sharma", "Patel", "Kumar", "Singh", "Gupta", "Agarwal", "Jain", "Shah"][i % 8]}`,
      successRate: Math.floor(Math.random() * 25) + 75, // 75-100%
      experience: Math.floor(Math.random() * 15) + 3, // 3-18 years
      languages: [
        "Hindi",
        "English",
        [
          "Gujarati",
          "Marathi",
          "Tamil",
          "Telugu",
          "Bengali",
          "Punjabi",
          "Kannada",
        ][i % 7],
      ],
      establishedYear: 2024 - Math.floor(Math.random() * 18) - 3, // 2003-2021
      specializations: [
        category.replace("-", " "),
        "Family Visa",
        "Student Visa",
        "Work Permit",
      ],
      clientsServed: Math.floor(Math.random() * 4500) + 1000, // 1000-5500 clients
    });
  }

  return businesses;
}

// Generate and cache the business data
let cachedBusinesses = null;

export function getAllBusinesses() {
  if (!cachedBusinesses) {
    cachedBusinesses = generateBusinessData();
    console.log("🎯 Generated 1500+ businesses for immediate use");
  }
  return cachedBusinesses;
}

export function getBusinesses(filters = {}) {
  const allBusinesses = getAllBusinesses();
  let filteredBusinesses = [...allBusinesses];

  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredBusinesses = filteredBusinesses.filter(
      (business) =>
        business.name?.toLowerCase().includes(searchTerm) ||
        business.description?.toLowerCase().includes(searchTerm) ||
        business.services?.some((service) =>
          service.toLowerCase().includes(searchTerm),
        ),
    );
  }

  if (filters.category && filters.category !== "all") {
    filteredBusinesses = filteredBusinesses.filter((business) => {
      const businessCategory = business.category?.toLowerCase();
      const searchCategory = filters.category.toLowerCase();
      return (
        businessCategory?.includes(searchCategory) ||
        businessCategory === searchCategory
      );
    });
  }

  if (filters.city && filters.city !== "all") {
    filteredBusinesses = filteredBusinesses.filter((business) => {
      const businessCity = business.city?.toLowerCase();
      const searchCity = filters.city.toLowerCase().replace(/-/g, " ");
      return (
        businessCity?.includes(searchCity) ||
        businessCity === searchCity ||
        businessCity?.replace(/\s+/g, "") === searchCity.replace(/\s+/g, "")
      );
    });
  }

  // Pagination
  const page = parseInt(filters.page) || 1;
  const limit = parseInt(filters.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);

  const totalBusinesses = filteredBusinesses.length;

  return {
    success: true,
    data: paginatedBusinesses,
    pagination: {
      page: page,
      totalPages: Math.ceil(totalBusinesses / limit),
      totalRecords: totalBusinesses,
      hasNext: endIndex < totalBusinesses,
      hasPrev: page > 1,
    },
    source: "client-side-data",
  };
}

export function getBusinessStats() {
  const businesses = getAllBusinesses();
  const cities = new Set(businesses.map((b) => b.city));
  const categories = new Set(businesses.map((b) => b.category));

  return {
    success: true,
    data: {
      totalBusinesses: businesses.length,
      totalReviews: businesses.reduce((sum, b) => sum + b.reviewCount, 0),
      citiesCount: cities.size,
      categoriesCount: categories.size,
      averageRating: 4.3,
      verifiedBusinesses: businesses.filter((b) => b.isVerified).length,
    },
    source: "client-side-data",
  };
}

export function getFeaturedBusinesses() {
  const businesses = getAllBusinesses();
  const featured = businesses
    .filter((b) => b.isFeatured)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  return {
    success: true,
    data: featured,
    source: "client-side-data",
  };
}
