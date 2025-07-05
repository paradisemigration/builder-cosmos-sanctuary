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
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  licenseNo?: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isScamReported: boolean;
  importedFromGoogle: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingHours?: {
    [key: string]: string;
  };
  reviews: Review[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  date: string;
  businessResponse?: string;
}

export type BusinessCategory =
  | "Visa Agent"
  | "Visa Services"
  | "Visa & Passport Services"
  | "Immigration Consultants"
  | "Document Clearing / Typing Centers"
  | "Travel Agencies (Visa-related)";

export const businessCategories: BusinessCategory[] = [
  "Visa Agent",
  "Visa Services",
  "Visa & Passport Services",
  "Immigration Consultants",
  "Document Clearing / Typing Centers",
  "Travel Agencies (Visa-related)",
];

export const sampleBusinesses: Business[] = [
  {
    id: "1",
    name: "Dubai Visa Express",
    category: "Visa Services",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/400/200",
    gallery: ["/api/placeholder/300/200", "/api/placeholder/300/200"],
    description:
      "Leading visa service provider in Dubai with over 15 years of experience. We specialize in tourist, business, and residence visas for all nationalities.",
    services: [
      "Tourist Visa",
      "Business Visa",
      "Residence Visa",
      "Visa Renewal",
      "Emergency Visa",
    ],
    address: "Office 1205, Al Manara Tower, Business Bay, Dubai, UAE",
    phone: "+971-4-123-4567",
    whatsapp: "+971-50-123-4567",
    email: "info@dubaivisaexpress.com",
    website: "https://dubaivisaexpress.com",
    licenseNo: "DED-12345",
    rating: 4.8,
    reviewCount: 156,
    isVerified: true,
    isScamReported: false,
    importedFromGoogle: false,
    coordinates: { lat: 25.1887, lng: 55.2673 },
    openingHours: {
      Monday: "9:00 AM - 6:00 PM",
      Tuesday: "9:00 AM - 6:00 PM",
      Wednesday: "9:00 AM - 6:00 PM",
      Thursday: "9:00 AM - 6:00 PM",
      Friday: "9:00 AM - 6:00 PM",
      Saturday: "10:00 AM - 4:00 PM",
      Sunday: "Closed",
    },
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "Ahmed Hassan",
        userAvatar: "/api/placeholder/40/40",
        rating: 5,
        comment:
          "Excellent service! Got my family visa processed in just 3 days. Highly professional team.",
        isVerified: true,
        date: "2024-01-15",
        businessResponse:
          "Thank you Ahmed! We're delighted to have helped your family.",
      },
    ],
  },
  {
    id: "2",
    name: "Emirates Immigration Consultants",
    category: "Immigration Consultants",
    logo: "/api/placeholder/80/80",
    coverImage: "/api/placeholder/400/200",
    description:
      "Certified immigration consultants specializing in UAE residence visas, golden visas, and citizenship services.",
    services: [
      "Golden Visa",
      "Investor Visa",
      "Skilled Worker Visa",
      "Family Reunion",
      "Citizenship Services",
    ],
    address: "Suite 2010, Emirates Towers, Sheikh Zayed Road, Dubai, UAE",
    phone: "+971-4-987-6543",
    whatsapp: "+971-50-987-6543",
    email: "contact@emiratesimmigration.ae",
    website: "https://emiratesimmigration.ae",
    licenseNo: "DED-67890",
    rating: 4.9,
    reviewCount: 203,
    isVerified: true,
    isScamReported: false,
    importedFromGoogle: true,
    coordinates: { lat: 25.2183, lng: 55.2671 },
    reviews: [
      {
        id: "r2",
        userId: "u2",
        userName: "Sarah Johnson",
        rating: 5,
        comment:
          "Professional service for my golden visa application. The team was very knowledgeable and helpful throughout the process.",
        isVerified: true,
        date: "2024-01-10",
      },
    ],
  },
  {
    id: "3",
    name: "Al Safeer Typing Center",
    category: "Document Clearing / Typing Centers",
    logo: "/api/placeholder/80/80",
    description:
      "Complete document clearing and typing services for visa applications, Emirates ID, and government paperwork.",
    services: [
      "Document Typing",
      "Visa Application",
      "Emirates ID",
      "Medical Insurance",
      "Labor Card",
    ],
    address: "Shop 15, Al Karama Center, Karama, Dubai, UAE",
    phone: "+971-4-456-7890",
    whatsapp: "+971-55-456-7890",
    email: "info@alsafeertypingcenter.com",
    licenseNo: "DED-11111",
    rating: 4.5,
    reviewCount: 89,
    isVerified: true,
    isScamReported: false,
    importedFromGoogle: true,
    coordinates: { lat: 25.2375, lng: 55.3075 },
    reviews: [
      {
        id: "r3",
        userId: "u3",
        userName: "Mohammed Ali",
        rating: 4,
        comment:
          "Quick and efficient service. Completed all my documents in one visit.",
        isVerified: false,
        date: "2024-01-05",
      },
    ],
  },
  {
    id: "4",
    name: "Sky Travel & Tours",
    category: "Travel Agencies (Visa-related)",
    logo: "/api/placeholder/80/80",
    description:
      "Full-service travel agency specializing in visa services, flight bookings, and travel packages worldwide.",
    services: [
      "Schengen Visa",
      "UK Visa",
      "US Visa",
      "Canada Visa",
      "Flight Booking",
      "Travel Insurance",
    ],
    address: "Office 801, Deira City Centre, Deira, Dubai, UAE",
    phone: "+971-4-234-5678",
    email: "bookings@skytraveldubai.com",
    website: "https://skytraveldubai.com",
    rating: 4.3,
    reviewCount: 67,
    isVerified: false,
    isScamReported: false,
    importedFromGoogle: false,
    coordinates: { lat: 25.2521, lng: 55.3331 },
    reviews: [],
  },
  {
    id: "5",
    name: "Quick Visa Solutions",
    category: "Visa Agent",
    logo: "/api/placeholder/80/80",
    description:
      "Fast and reliable visa processing for tourists and business travelers. Same-day service available for urgent cases.",
    services: [
      "96-Hour Visa",
      "Tourist Visa",
      "Transit Visa",
      "Business Visa",
      "Visit Visa Extension",
    ],
    address: "Ground Floor, Al Ghurair Centre, Deira, Dubai, UAE",
    phone: "+971-4-345-6789",
    whatsapp: "+971-56-345-6789",
    email: "support@quickvisasolutions.ae",
    rating: 4.1,
    reviewCount: 45,
    isVerified: true,
    isScamReported: true,
    importedFromGoogle: false,
    coordinates: { lat: 25.2697, lng: 55.3095 },
    reviews: [
      {
        id: "r4",
        userId: "u4",
        userName: "Lisa Chen",
        rating: 2,
        comment:
          "Had issues with processing time. Took much longer than promised.",
        isVerified: true,
        date: "2024-01-01",
      },
    ],
  },
  {
    id: "6",
    name: "Royal Passport Services",
    category: "Visa & Passport Services",
    logo: "/api/placeholder/80/80",
    description:
      "Comprehensive passport and visa services including renewals, attestations, and embassy liaisons.",
    services: [
      "Passport Renewal",
      "Document Attestation",
      "Embassy Services",
      "Apostille",
      "Visa Stamping",
    ],
    address: "Level 3, Ibn Battuta Mall, Jebel Ali, Dubai, UAE",
    phone: "+971-4-567-8901",
    whatsapp: "+971-52-567-8901",
    email: "info@royalpassportservices.com",
    website: "https://royalpassportservices.com",
    licenseNo: "DED-22222",
    rating: 4.7,
    reviewCount: 128,
    isVerified: true,
    isScamReported: false,
    importedFromGoogle: true,
    coordinates: { lat: 25.0436, lng: 55.1164 },
    reviews: [
      {
        id: "r5",
        userId: "u5",
        userName: "Raj Patel",
        rating: 5,
        comment:
          "Excellent service for passport renewal. Very professional and timely.",
        isVerified: true,
        date: "2023-12-28",
      },
    ],
  },
];

export const featuredBusinesses = sampleBusinesses.filter(
  (business) => business.isVerified && business.rating >= 4.5,
);

export const dubaiZones = [
  "Business Bay",
  "Downtown Dubai",
  "Dubai Marina",
  "Deira",
  "Bur Dubai",
  "Jumeirah",
  "Sheikh Zayed Road",
  "Dubai International City",
  "Karama",
  "Al Barsha",
  "Jebel Ali",
];
