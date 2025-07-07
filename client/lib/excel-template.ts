// Excel Template Structure for Business Listings

export interface ExcelBusinessRow {
  // Required Fields
  business_name: string;
  category: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;

  // Optional Fields
  whatsapp?: string;
  website?: string;
  license_number?: string;
  owner_name?: string;
  owner_email?: string;
  owner_phone?: string;

  // Services (comma-separated)
  services?: string;

  // Location
  latitude?: number;
  longitude?: number;

  // Operating Hours (format: "9:00 AM - 6:00 PM")
  monday_hours?: string;
  tuesday_hours?: string;
  wednesday_hours?: string;
  thursday_hours?: string;
  friday_hours?: string;
  saturday_hours?: string;
  sunday_hours?: string;

  // Additional Info
  logo_url?: string;
  cover_image_url?: string;
  gallery_urls?: string; // comma-separated URLs

  // Status
  is_verified?: boolean;
  notes?: string;
}

// Excel Column Headers and Validation Rules
export const excelTemplate = {
  headers: [
    // Required columns (marked with *)
    {
      key: "business_name",
      label: "Business Name *",
      required: true,
      maxLength: 100,
    },
    {
      key: "category",
      label: "Category *",
      required: true,
      validValues: [
        "Visa Agent",
        "Immigration Consultants",
        "Visa Services",
        "Visa & Passport Services",
        "Document Clearing / Typing Centers",
        "Travel Agencies (Visa-related)",
        "Visit Visa Specialists",
        "Work Visa Consultants",
        "Study Visa Services",
        "PR & Citizenship Services",
        "Business Setup & Visa",
        "Family Visa Services",
      ],
    },
    {
      key: "description",
      label: "Business Description *",
      required: true,
      maxLength: 500,
    },
    { key: "address", label: "Full Address *", required: true, maxLength: 200 },
    {
      key: "city",
      label: "City *",
      required: true,
      validValues: [
        "Dubai",
        "Abu Dhabi",
        "Sharjah",
        "Ajman",
        "Ras Al Khaimah",
        "Fujairah",
        "Umm Al Quwain",
        "Al Ain",
      ],
    },
    {
      key: "phone",
      label: "Phone Number *",
      required: true,
      format: "+971-X-XXX-XXXX",
    },
    { key: "email", label: "Email Address *", required: true, format: "email" },

    // Optional columns
    { key: "whatsapp", label: "WhatsApp Number", format: "+971-XX-XXX-XXXX" },
    { key: "website", label: "Website URL", format: "https://example.com" },
    { key: "license_number", label: "License Number", maxLength: 50 },
    { key: "owner_name", label: "Owner/Manager Name", maxLength: 100 },
    { key: "owner_email", label: "Owner Email", format: "email" },
    { key: "owner_phone", label: "Owner Phone", format: "+971-XX-XXX-XXXX" },

    // Services
    {
      key: "services",
      label: "Services Offered",
      format: "Service1, Service2, Service3",
      maxLength: 300,
    },

    // Location coordinates
    { key: "latitude", label: "Latitude", format: "25.1234", type: "number" },
    { key: "longitude", label: "Longitude", format: "55.1234", type: "number" },

    // Operating hours
    {
      key: "monday_hours",
      label: "Monday Hours",
      format: "9:00 AM - 6:00 PM or Closed",
    },
    {
      key: "tuesday_hours",
      label: "Tuesday Hours",
      format: "9:00 AM - 6:00 PM or Closed",
    },
    {
      key: "wednesday_hours",
      label: "Wednesday Hours",
      format: "9:00 AM - 6:00 PM or Closed",
    },
    {
      key: "thursday_hours",
      label: "Thursday Hours",
      format: "9:00 AM - 6:00 PM or Closed",
    },
    {
      key: "friday_hours",
      label: "Friday Hours",
      format: "9:00 AM - 6:00 PM or Closed",
    },
    {
      key: "saturday_hours",
      label: "Saturday Hours",
      format: "9:00 AM - 6:00 PM or Closed",
    },
    {
      key: "sunday_hours",
      label: "Sunday Hours",
      format: "9:00 AM - 6:00 PM or Closed",
    },

    // Media URLs
    {
      key: "logo_url",
      label: "Logo Image URL",
      format: "https://example.com/logo.jpg",
    },
    {
      key: "cover_image_url",
      label: "Cover Image URL",
      format: "https://example.com/cover.jpg",
    },
    {
      key: "gallery_urls",
      label: "Gallery Image URLs",
      format: "url1.jpg, url2.jpg, url3.jpg",
    },

    // Status
    {
      key: "is_verified",
      label: "Pre-Verified",
      format: "TRUE/FALSE",
      type: "boolean",
    },
    { key: "notes", label: "Additional Notes", maxLength: 200 },
  ],
};

// Sample data for Excel template
export const sampleExcelData: ExcelBusinessRow[] = [
  {
    business_name: "Dubai Visa Express",
    category: "Visa Services",
    description:
      "Leading visa service provider in Dubai with over 15 years of experience. We specialize in tourist, business, and residence visas for all nationalities.",
    address: "Office 1205, Al Manara Tower, Business Bay, Dubai, UAE",
    city: "Dubai",
    phone: "+971-4-123-4567",
    email: "info@dubaivisaexpress.com",
    whatsapp: "+971-50-123-4567",
    website: "https://dubaivisaexpress.com",
    license_number: "DED-12345",
    owner_name: "Ahmed Al Mansoori",
    owner_email: "ahmed@dubaivisaexpress.com",
    owner_phone: "+971-50-123-4567",
    services:
      "Tourist Visa, Business Visa, Residence Visa, Visa Renewal, Emergency Visa",
    latitude: 25.1887,
    longitude: 55.2673,
    monday_hours: "9:00 AM - 6:00 PM",
    tuesday_hours: "9:00 AM - 6:00 PM",
    wednesday_hours: "9:00 AM - 6:00 PM",
    thursday_hours: "9:00 AM - 6:00 PM",
    friday_hours: "9:00 AM - 6:00 PM",
    saturday_hours: "10:00 AM - 4:00 PM",
    sunday_hours: "Closed",
    logo_url: "https://example.com/dubai-visa-express-logo.jpg",
    cover_image_url: "https://example.com/dubai-visa-express-cover.jpg",
    gallery_urls:
      "https://example.com/office1.jpg, https://example.com/office2.jpg",
    is_verified: true,
    notes: "Established business with excellent track record",
  },
  {
    business_name: "Emirates Immigration Consultants",
    category: "Immigration Consultants",
    description:
      "Professional immigration consultancy providing expert advice on UAE residency, citizenship, and business setup. Specialized in Golden Visa applications.",
    address: "Suite 503, Emirates Tower, Sheikh Zayed Road, Dubai, UAE",
    city: "Dubai",
    phone: "+971-4-987-6543",
    email: "info@emiratesimmigration.ae",
    whatsapp: "+971-55-987-6543",
    website: "https://emiratesimmigration.ae",
    license_number: "DED-67890",
    services:
      "Golden Visa, Investor Visa, Business Setup, Family Sponsorship, Citizenship Applications",
    latitude: 25.2048,
    longitude: 55.2708,
    monday_hours: "8:00 AM - 7:00 PM",
    tuesday_hours: "8:00 AM - 7:00 PM",
    wednesday_hours: "8:00 AM - 7:00 PM",
    thursday_hours: "8:00 AM - 7:00 PM",
    friday_hours: "8:00 AM - 5:00 PM",
    saturday_hours: "9:00 AM - 3:00 PM",
    sunday_hours: "Closed",
    is_verified: true,
  },
];

// Validation functions
export const validateExcelRow = (
  row: any,
  rowIndex: number,
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check required fields
  excelTemplate.headers.forEach((header) => {
    if (
      header.required &&
      (!row[header.key] || String(row[header.key]).trim() === "")
    ) {
      errors.push(`Row ${rowIndex + 1}: ${header.label} is required`);
    }

    // Validate category
    if (
      header.key === "category" &&
      row[header.key] &&
      !header.validValues?.includes(row[header.key])
    ) {
      errors.push(
        `Row ${rowIndex + 1}: Invalid category "${row[header.key]}". Must be one of: ${header.validValues?.join(", ")}`,
      );
    }

    // Validate city
    if (
      header.key === "city" &&
      row[header.key] &&
      !header.validValues?.includes(row[header.key])
    ) {
      errors.push(
        `Row ${rowIndex + 1}: Invalid city "${row[header.key]}". Must be one of: ${header.validValues?.join(", ")}`,
      );
    }

    // Validate email format
    if (
      (header.key === "email" || header.key === "owner_email") &&
      row[header.key]
    ) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row[header.key])) {
        errors.push(
          `Row ${rowIndex + 1}: Invalid email format for ${header.label}`,
        );
      }
    }

    // Validate phone format
    if (
      (header.key === "phone" ||
        header.key === "whatsapp" ||
        header.key === "owner_phone") &&
      row[header.key]
    ) {
      const phoneRegex = /^\+971-\d{1,2}-\d{3}-\d{4}$/;
      if (!phoneRegex.test(row[header.key])) {
        errors.push(
          `Row ${rowIndex + 1}: Invalid phone format for ${header.label}. Use format: +971-X-XXX-XXXX`,
        );
      }
    }

    // Validate URL format
    if (
      (header.key === "website" ||
        header.key === "logo_url" ||
        header.key === "cover_image_url") &&
      row[header.key]
    ) {
      try {
        new URL(row[header.key]);
      } catch {
        errors.push(
          `Row ${rowIndex + 1}: Invalid URL format for ${header.label}`,
        );
      }
    }

    // Validate coordinates
    if (
      header.key === "latitude" &&
      row[header.key] &&
      (row[header.key] < -90 || row[header.key] > 90)
    ) {
      errors.push(`Row ${rowIndex + 1}: Latitude must be between -90 and 90`);
    }
    if (
      header.key === "longitude" &&
      row[header.key] &&
      (row[header.key] < -180 || row[header.key] > 180)
    ) {
      errors.push(
        `Row ${rowIndex + 1}: Longitude must be between -180 and 180`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
