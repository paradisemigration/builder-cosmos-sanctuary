// Vercel API function to serve business data
import { sampleBusinesses } from '../client/lib/data.js';

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { page = 1, limit = 25, search, category, city } = req.query;
    
    // TODO: Connect to your real database with 1500+ businesses
    // For now, using sample data until database is properly deployed
    let businesses = [...sampleBusinesses];
    
    // Apply filters
    if (search) {
      const searchTerm = search.toLowerCase();
      businesses = businesses.filter(
        business =>
          business.name?.toLowerCase().includes(searchTerm) ||
          business.description?.toLowerCase().includes(searchTerm) ||
          business.services?.some(service =>
            service.toLowerCase().includes(searchTerm)
          )
      );
    }

    if (category && category !== 'all') {
      businesses = businesses.filter(business =>
        business.category?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (city && city !== 'all') {
      businesses = businesses.filter(business =>
        business.city?.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedBusinesses = businesses.slice(startIndex, endIndex);

    const response = {
      success: true,
      businesses: paginatedBusinesses,
      pagination: {
        page: pageNum,
        totalPages: Math.ceil(businesses.length / limitNum),
        totalRecords: businesses.length,
        hasNext: endIndex < businesses.length,
        hasPrev: pageNum > 1,
      }
    };

    res.status(200).json(response);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
