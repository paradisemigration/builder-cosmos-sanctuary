import sqliteDatabase from "./database.sqlite.js";

// Generate 1500+ realistic businesses for your database
async function populateDatabase() {
  console.log("🎯 Starting database population with 1500+ businesses...");

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

  const services = [
    "Immigration Consulting",
    "Visa Application Support",
    "Documentation Services",
    "Interview Preparation",
    "Application Review",
    "Legal Compliance",
    "Study Abroad Guidance",
    "Work Permit Assistance",
    "Family Visa Services",
    "Tourist Visa Processing",
    "Business Visa Support",
    "Express Processing",
    "Document Translation",
    "Educational Counseling",
    "University Applications",
    "Scholarship Guidance",
  ];

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < 1500; i++) {
    try {
      const prefix = companyPrefixes[i % companyPrefixes.length];
      const suffix = companySuffixes[i % companySuffixes.length];
      const city = indianCities[i % indianCities.length];
      const category = categories[i % categories.length];

      const businessData = {
        id: `business-${i + 1}`,
        googlePlaceId: `real-place-${i + 1}`,
        name: `${prefix} ${suffix}`,
        category,
        scrapedCategory: category,
        description: `Professional immigration and visa consultancy services in ${city}. Specialized in ${category.replace("-", " ")} with proven track record. Over ${Math.floor(Math.random() * 15) + 5} years of experience serving clients with high success rates.`,
        phone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        website: `https://www.${prefix.toLowerCase()}${suffix.toLowerCase().replace(/\s+/g, "")}.com`,
        address: `${Math.floor(Math.random() * 999) + 1}, Business District, ${city}, India`,
        city,
        scrapedCity: city,
        state: getStateForCity(city),
        rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // 3.5 - 5.0
        reviewCount: Math.floor(Math.random() * 150) + 25, // 25-175 reviews
        isVerified: Math.random() > 0.05, // 95% verified
        businessHours: {
          Monday: "9:00 AM - 7:00 PM",
          Tuesday: "9:00 AM - 7:00 PM",
          Wednesday: "9:00 AM - 7:00 PM",
          Thursday: "9:00 AM - 7:00 PM",
          Friday: "9:00 AM - 7:00 PM",
          Saturday: "9:00 AM - 5:00 PM",
          Sunday: "Closed",
        },
        priceLevel: Math.floor(Math.random() * 4) + 1, // 1-4
      };

      const result = await sqliteDatabase.saveBusiness(businessData);
      if (result.success) {
        successCount++;
        if (successCount % 100 === 0) {
          console.log(`✅ Saved ${successCount} businesses...`);
        }
      } else {
        errorCount++;
      }
    } catch (error) {
      console.error(`❌ Error saving business ${i + 1}:`, error.message);
      errorCount++;
    }
  }

  console.log(`🎉 Database population complete!`);
  console.log(`✅ Successfully saved: ${successCount} businesses`);
  console.log(`❌ Errors: ${errorCount}`);

  // Test the data
  const testResult = await sqliteDatabase.getBusinesses({ limit: 5 });
  console.log(
    `📊 Test query returned ${testResult.businesses?.length || 0} businesses`,
  );

  if (testResult.businesses?.length > 0) {
    console.log("🎯 Sample business:", {
      id: testResult.businesses[0].id,
      name: testResult.businesses[0].name,
      city: testResult.businesses[0].city,
      category: testResult.businesses[0].category,
    });
  }

  return { successCount, errorCount };
}

// Helper function to get state for a city
function getStateForCity(city) {
  const stateMap = {
    Mumbai: "Maharashtra",
    Pune: "Maharashtra",
    Thane: "Maharashtra",
    Nashik: "Maharashtra",
    Delhi: "Delhi",
    Ghaziabad: "Uttar Pradesh",
    Faridabad: "Haryana",
    Bangalore: "Karnataka",
    Chennai: "Tamil Nadu",
    Hyderabad: "Telangana",
    Kolkata: "West Bengal",
    Howrah: "West Bengal",
    Asansol: "West Bengal",
    Ahmedabad: "Gujarat",
    Surat: "Gujarat",
    Vadodara: "Gujarat",
    Rajkot: "Gujarat",
    Jaipur: "Rajasthan",
    Ajmer: "Rajasthan",
    Sikar: "Rajasthan",
    Lucknow: "Uttar Pradesh",
    Kanpur: "Uttar Pradesh",
    Agra: "Uttar Pradesh",
    Allahabad: "Uttar Pradesh",
    Nagpur: "Maharashtra",
    Indore: "Madhya Pradesh",
    Bhopal: "Madhya Pradesh",
    Patna: "Bihar",
    Ranchi: "Jharkhand",
    Visakhapatnam: "Andhra Pradesh",
  };
  return stateMap[city] || "India";
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  populateDatabase()
    .then((result) => {
      console.log("✅ Population completed:", result);
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Population failed:", error);
      process.exit(1);
    });
}

export default populateDatabase;
