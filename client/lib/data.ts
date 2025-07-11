// India Visa Consultant Directory - Complete Data Structure

export interface Business {
  id: string;
  name: string;
  category: BusinessCategory;
  logo?: string;
  coverImage?: string;
  gallery?: string[];
  description: string;
  services: string[];
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  licenseNo?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  plan: "free" | "premium" | "business";
  establishedYear?: number;
  successRate?: number;
  languages: string[];
  specializations: string[];
  countriesServed: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours?: {
    [key: string]: string;
  };
  paymentMethods: string[];
  reviews: Review[];
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  visaType?: string;
  country?: string;
  images?: string[];
  isVerified: boolean;
  date: string;
  businessResponse?: string;
}

export type BusinessCategory =
  | "Student Visa Consultants"
  | "Work Visa Consultants"
  | "Tourist Visa Services"
  | "Business Visa Services"
  | "Immigration Lawyers"
  | "Study Abroad Consultants"
  | "PR & Citizenship Services"
  | "Visa Documentation Services"
  | "Embassy Services"
  | "Visa Interview Preparation"
  | "Language Training Centers"
  | "Education Consultants";

export const businessCategories: BusinessCategory[] = [
  "Student Visa Consultants",
  "Work Visa Consultants",
  "Tourist Visa Services",
  "Business Visa Services",
  "Immigration Lawyers",
  "Study Abroad Consultants",
  "PR & Citizenship Services",
  "Visa Documentation Services",
  "Embassy Services",
  "Visa Interview Preparation",
  "Language Training Centers",
  "Education Consultants",
];

export const visaTypes = [
  "Student Visa",
  "Work Visa",
  "Tourist Visa",
  "Business Visa",
  "Transit Visa",
  "Medical Visa",
  "Conference Visa",
  "Employment Visa",
  "Dependent Visa",
  "Permanent Residency",
] as const;

export type VisaType = (typeof visaTypes)[number];

// Major Indian Cities
export const indianCities = [
  // Tier 1 Cities
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Pune",
  "Ahmedabad",

  // Popular Metro Cities
  "Jaipur",
  "Lucknow",
  "Indore",
  "Chandigarh",
  "Gurgaon",
  "Noida",
  "Dehradun",
  "Kochi", // Kerala major city

  // Other Major Cities
  "Surat",
  "Kanpur",
  "Nagpur",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Kalyan-Dombivali",
  "Vasai-Virar",
  "Varanasi",
  "Srinagar",
  "Aurangabad",
  "Dhanbad",
  "Amritsar",
  "Navi Mumbai",
  "Allahabad",
  "Ranchi",
  "Howrah",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Jodhpur",
  "Madurai",
  "Raipur",
  "Kota",
  "Guwahati",
];

// Dubai zones for backward compatibility (can be removed later)
export const dubaiZones = [
  "Business Bay",
  "Downtown Dubai",
  "Dubai Marina",
  "JLT",
  "DIFC",
  "Deira",
  "Bur Dubai",
  "Jumeirah",
];

// Keep UAE cities for backward compatibility
export const uaeCities = indianCities;

// Sample Businesses
export const sampleBusinesses: Business[] = [
  {
    id: "1",
    name: "Delhi Global Visa Consultants",
    category: "Student Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    gallery: [
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
      "/api/placeholder/300/200",
    ],
    description:
      "Leading student visa consultancy in Delhi with 15+ years of experience. We specialize in admissions and visa assistance for USA, Canada, UK, Australia, and European universities.",
    services: [
      "Student Visa for USA",
      "Student Visa for Canada",
      "Student Visa for UK",
      "Student Visa for Australia",
      "University Admissions",
      "Scholarship Guidance",
      "IELTS/TOEFL Preparation",
      "SOP Writing",
      "Document Verification",
    ],
    address: "A-25, Connaught Place, Central Delhi",
    city: "Delhi",
    state: "Delhi",
    pincode: "110001",
    phone: "+91-11-4567-8901",
    whatsapp: "+91-98765-43210",
    email: "info@delhiglobalvisa.com",
    website: "https://delhiglobalvisa.com",
    licenseNo: "EDU-DL-2024-001",
    rating: 4.8,
    reviewCount: 234,
    isVerified: true,
    isFeatured: true,
    plan: "business",
    establishedYear: 2009,
    successRate: 95,
    languages: ["Hindi", "English", "Punjabi"],
    specializations: ["USA F1 Visa", "Canada Study Permits", "UK Tier 4"],
    countriesServed: ["USA", "Canada", "UK", "Australia", "Germany", "France"],
    coordinates: { lat: 28.6328, lng: 77.2197 },
    openingHours: {
      Monday: "9:00 AM - 7:00 PM",
      Tuesday: "9:00 AM - 7:00 PM",
      Wednesday: "9:00 AM - 7:00 PM",
      Thursday: "9:00 AM - 7:00 PM",
      Friday: "9:00 AM - 7:00 PM",
      Saturday: "10:00 AM - 5:00 PM",
      Sunday: "Closed",
    },
    paymentMethods: ["Cash", "Card", "UPI", "Net Banking"],
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "Priya Sharma",
        userAvatar: "/api/placeholder/40/40",
        rating: 5,
        comment:
          "Excellent service! Got my USA student visa approved in just 3 weeks. The team was very professional and guided me throughout the process.",
        visaType: "Student Visa",
        country: "USA",
        isVerified: true,
        date: "2024-01-15",
      },
      {
        id: "r2",
        userId: "u2",
        userName: "Rahul Kumar",
        rating: 5,
        comment:
          "Best consultancy in Delhi! They helped me get admission to University of Toronto and visa was approved without any hassle.",
        visaType: "Student Visa",
        country: "Canada",
        isVerified: true,
        date: "2024-01-10",
      },
    ],
    socialMedia: {
      facebook: "https://facebook.com/delhiglobalvisa",
      instagram: "https://instagram.com/delhiglobalvisa",
      linkedin: "https://linkedin.com/company/delhiglobalvisa",
    },
  },
  {
    id: "2",
    name: "Mumbai Immigration Hub",
    category: "Work Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    gallery: ["/api/placeholder/300/200"],
    description:
      "Premier work visa consultancy in Mumbai specializing in employment-based immigration to Canada, Australia, and European countries.",
    services: [
      "Express Entry Canada",
      "Australia PR",
      "Germany Work Visa",
      "UK Skilled Worker Visa",
      "Job Search Assistance",
      "Resume Building",
      "Interview Preparation",
    ],
    address: "Office 15, Nariman Point, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400021",
    phone: "+91-22-6789-0123",
    whatsapp: "+91-97654-32109",
    email: "contact@mumbaiimmigration.com",
    website: "https://mumbaiimmigration.com",
    licenseNo: "IMM-MH-2024-002",
    rating: 4.7,
    reviewCount: 189,
    isVerified: true,
    isFeatured: true,
    plan: "premium",
    establishedYear: 2012,
    successRate: 92,
    languages: ["Hindi", "English", "Marathi", "Gujarati"],
    specializations: ["Express Entry", "Australia PR", "Europe Work Permits"],
    countriesServed: ["Canada", "Australia", "Germany", "Netherlands", "UK"],
    coordinates: { lat: 18.9322, lng: 72.8264 },
    openingHours: {
      Monday: "9:30 AM - 6:30 PM",
      Tuesday: "9:30 AM - 6:30 PM",
      Wednesday: "9:30 AM - 6:30 PM",
      Thursday: "9:30 AM - 6:30 PM",
      Friday: "9:30 AM - 6:30 PM",
      Saturday: "10:00 AM - 4:00 PM",
      Sunday: "Closed",
    },
    paymentMethods: ["Cash", "Card", "UPI", "Net Banking", "Cheque"],
    reviews: [
      {
        id: "r3",
        userId: "u3",
        userName: "Amit Patel",
        rating: 5,
        comment:
          "Outstanding service for Canada PR. They handled everything professionally and I got my invitation in 6 months!",
        visaType: "Work Visa",
        country: "Canada",
        isVerified: true,
        date: "2024-01-08",
      },
    ],
  },
  {
    id: "3",
    name: "Bangalore Study Abroad Center",
    category: "Study Abroad Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Premier study abroad consultancy in Bangalore helping students achieve their dreams of international education.",
    services: [
      "University Selection",
      "Application Processing",
      "Visa Assistance",
      "Scholarship Guidance",
      "Test Preparation",
      "Pre-departure Orientation",
    ],
    address: "MG Road, Brigade Towers, Bangalore",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
    phone: "+91-80-1234-5678",
    email: "info@bangalorestudyabroad.com",
    licenseNo: "EDU-KA-2024-003",
    rating: 4.6,
    reviewCount: 156,
    isVerified: true,
    isFeatured: false,
    plan: "premium",
    establishedYear: 2015,
    successRate: 88,
    languages: ["English", "Hindi", "Kannada", "Tamil"],
    specializations: ["IT Programs", "Engineering", "Business Studies"],
    countriesServed: ["USA", "UK", "Australia", "Canada", "Germany"],
    coordinates: { lat: 12.9716, lng: 77.5946 },
    paymentMethods: ["Card", "UPI", "Net Banking"],
    reviews: [],
  },
  // Mumbai businesses
  {
    id: "4",
    name: "Mumbai Visa Solutions",
    category: "Student Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Premier visa consultancy in Mumbai offering comprehensive student visa services for top universities worldwide.",
    services: [
      "Student Visa for USA",
      "Student Visa for UK",
      "Student Visa for Canada",
      "IELTS Preparation",
    ],
    address: "Nariman Point, Mumbai",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400021",
    phone: "+91-22-1234-5678",
    email: "info@mumbaivivasolutions.com",
    rating: 4.5,
    reviewCount: 89,
    isVerified: true,
    isFeatured: false,
    plan: "premium",
    languages: ["Hindi", "English", "Marathi"],
    specializations: ["Student Visas", "University Admissions"],
    countriesServed: ["USA", "UK", "Canada", "Australia"],
    coordinates: { lat: 19.076, lng: 72.8777 },
    paymentMethods: ["Cash", "Card", "UPI"],
    reviews: [],
  },
  // Jaipur businesses
  {
    id: "5",
    name: "Jaipur Immigration Services",
    category: "Work Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Specialized work visa consultancy in Jaipur with expertise in global employment opportunities.",
    services: [
      "Work Visa for Canada",
      "Work Visa for Australia",
      "Work Visa for Germany",
      "Job Placement",
    ],
    address: "C-Scheme, Jaipur",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    phone: "+91-141-123-4567",
    email: "contact@jaipurimmigration.com",
    rating: 4.3,
    reviewCount: 67,
    isVerified: true,
    isFeatured: false,
    plan: "premium",
    languages: ["Hindi", "English", "Rajasthani"],
    specializations: ["Work Visas", "Job Placement"],
    countriesServed: ["Canada", "Australia", "Germany", "UAE"],
    coordinates: { lat: 26.9124, lng: 75.7873 },
    paymentMethods: ["Cash", "Card", "UPI"],
    reviews: [],
  },
  // Lucknow businesses
  {
    id: "6",
    name: "Lucknow Global Consultants",
    category: "Tourist Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Leading tourist visa specialists in Lucknow helping families and individuals explore the world.",
    services: [
      "Tourist Visa for Europe",
      "Tourist Visa for USA",
      "Tourist Visa for Singapore",
      "Travel Insurance",
    ],
    address: "Hazratganj, Lucknow",
    city: "Lucknow",
    state: "Uttar Pradesh",
    pincode: "226001",
    phone: "+91-522-123-4567",
    email: "info@lucknowglobal.com",
    rating: 4.4,
    reviewCount: 78,
    isVerified: true,
    isFeatured: false,
    plan: "premium",
    languages: ["Hindi", "English", "Urdu"],
    specializations: ["Tourist Visas", "Travel Insurance"],
    countriesServed: ["Europe", "USA", "Singapore", "Thailand"],
    coordinates: { lat: 26.8467, lng: 80.9462 },
    paymentMethods: ["Cash", "Card", "UPI"],
    reviews: [],
  },
  // Chandigarh businesses
  {
    id: "7",
    name: "Chandigarh Study Abroad",
    category: "Student Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Trusted study abroad consultancy in Chandigarh with successful track record in student placements.",
    services: [
      "Student Visa for UK",
      "Student Visa for Australia",
      "Student Visa for New Zealand",
      "Scholarship Guidance",
    ],
    address: "Sector 17, Chandigarh",
    city: "Chandigarh",
    state: "Chandigarh",
    pincode: "160017",
    phone: "+91-172-123-4567",
    email: "admissions@chandigarhstudyabroad.com",
    rating: 4.6,
    reviewCount: 92,
    isVerified: true,
    isFeatured: false,
    plan: "business",
    languages: ["Hindi", "English", "Punjabi"],
    specializations: ["Student Visas", "Scholarship Guidance"],
    countriesServed: ["UK", "Australia", "New Zealand", "Canada"],
    coordinates: { lat: 30.7333, lng: 76.7794 },
    paymentMethods: ["Cash", "Card", "UPI", "Net Banking"],
    reviews: [],
  },
  // Gurgaon businesses
  {
    id: "8",
    name: "Gurgaon Immigration Hub",
    category: "Business Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Corporate immigration solutions in Gurgaon specializing in business visas and investor programs.",
    services: [
      "Business Visa for USA",
      "Investor Visa for Canada",
      "Business Visa for UK",
      "Corporate Immigration",
    ],
    address: "DLF Phase 1, Gurgaon",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122002",
    phone: "+91-124-123-4567",
    email: "business@gurgaonimmigration.com",
    rating: 4.7,
    reviewCount: 134,
    isVerified: true,
    isFeatured: false,
    plan: "business",
    languages: ["Hindi", "English"],
    specializations: ["Business Visas", "Investor Programs"],
    countriesServed: ["USA", "Canada", "UK", "Australia"],
    coordinates: { lat: 28.4595, lng: 77.0266 },
    paymentMethods: ["Card", "UPI", "Net Banking"],
    reviews: [],
  },
  // Noida businesses
  {
    id: "9",
    name: "Noida Visa Center",
    category: "Student Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Modern visa consultancy in Noida providing end-to-end student visa services with technology integration.",
    services: [
      "Student Visa for USA",
      "Student Visa for Germany",
      "Student Visa for France",
      "Digital Documentation",
    ],
    address: "Sector 18, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    phone: "+91-120-123-4567",
    email: "support@noidavisacenter.com",
    rating: 4.5,
    reviewCount: 156,
    isVerified: true,
    isFeatured: false,
    plan: "premium",
    languages: ["Hindi", "English"],
    specializations: ["Student Visas", "Digital Documentation"],
    countriesServed: ["USA", "Germany", "France", "Netherlands"],
    coordinates: { lat: 28.5355, lng: 77.391 },
    paymentMethods: ["Card", "UPI", "Net Banking"],
    reviews: [],
  },
  // Kochi businesses
  {
    id: "10",
    name: "Kerala Global Services",
    category: "Work Visa Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/800/400",
    description:
      "Premier immigration consultancy in Kerala specializing in Gulf country work visas and placements.",
    services: [
      "Work Visa for UAE",
      "Work Visa for Saudi Arabia",
      "Work Visa for Qatar",
      "Gulf Job Placement",
    ],
    address: "Marine Drive, Kochi",
    city: "Kochi",
    state: "Kerala",
    pincode: "682031",
    phone: "+91-484-123-4567",
    email: "info@keralaglobalservices.com",
    rating: 4.4,
    reviewCount: 167,
    isVerified: true,
    isFeatured: false,
    plan: "premium",
    languages: ["Malayalam", "English", "Hindi"],
    specializations: ["Gulf Work Visas", "Job Placement"],
    countriesServed: ["UAE", "Saudi Arabia", "Qatar", "Kuwait"],
    coordinates: { lat: 9.9312, lng: 76.2673 },
    paymentMethods: ["Cash", "Card", "UPI"],
    reviews: [],
  },
];

export const featuredBusinesses = sampleBusinesses.filter((b) => b.isFeatured);

// Listing Plans
export interface ListingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  limitations?: string[];
  popular?: boolean;
  color: string;
  buttonColor: string;
}

export const listingPlans: ListingPlan[] = [
  {
    id: "free",
    name: "Free Listing",
    price: 0,
    period: "Forever",
    description: "Get started with basic listing features",
    features: [
      "Basic business profile",
      "Contact information display",
      "Business category listing",
      "Customer reviews",
      "Basic search visibility",
    ],
    limitations: [
      "Limited to 3 photos",
      "No priority ranking",
      "No featured badge",
      "Standard support only",
    ],
    color: "border-gray-200",
    buttonColor: "bg-gray-600 hover:bg-gray-700",
  },
  {
    id: "premium",
    name: "Premium",
    price: 2999,
    period: "per month",
    description: "Enhanced visibility and professional features",
    features: [
      "All Free features included",
      "Up to 20 photos & videos",
      "Premium badge & verification",
      "Priority search ranking",
      "Analytics dashboard",
      "WhatsApp integration",
      "Social media links",
      "Priority customer support",
    ],
    popular: true,
    color: "border-orange-300 bg-orange-50",
    buttonColor: "bg-orange-600 hover:bg-orange-700",
  },
  {
    id: "business",
    name: "Business Pro",
    price: 4999,
    period: "per month",
    description: "Complete business growth solution",
    features: [
      "All Premium features included",
      "Unlimited photos & videos",
      "Featured listing placement",
      "Homepage showcase opportunity",
      "Advanced analytics & insights",
      "Lead generation tools",
      "Multiple branch listings",
      "Dedicated account manager",
    ],
    color: "border-purple-300 bg-purple-50",
    buttonColor: "bg-purple-600 hover:bg-purple-700",
  },
];

export default sampleBusinesses;
