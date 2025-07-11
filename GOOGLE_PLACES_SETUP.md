# Google Places API Data Scraping Setup Guide

## 🚀 Complete Business Data Automation

This system automatically fetches real business data from Google Maps/Places including:

- **Company names & contact details**
- **Business images & logos**
- **Customer reviews & ratings**
- **Location data & operating hours**
- **Automatic storage** in your database & Google Cloud

## Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `extreme-water-465615-i5`
3. Enable APIs:

   - **Places API**
   - **Places API (New)**
   - **Geocoding API**
   - **Maps JavaScript API**

4. Create API Key:
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the API key
   - **Restrict the key** to your APIs for security

## Step 2: Configure Environment

Update your `.env` file:

```env
# Add this line to your existing .env
GOOGLE_PLACES_API_KEY=AIzaSyD7F8N_YOUR_ACTUAL_API_KEY_HERE
```

## Step 3: Restart Server

```bash
npm run dev
```

## Step 4: Start Scraping

1. Go to **Admin Panel** → **Data Scraper** tab
2. Select cities (Delhi, Mumbai, Bangalore, etc.)
3. Select categories (visa consultant, immigration lawyer, etc.)
4. Click "Start Scraping"

## 🎯 What Gets Scraped

### Business Information

- ✅ **Company Name**
- ✅ **Phone Number**
- ✅ **Address & Location**
- ✅ **Website URL**
- ✅ **Business Category**
- ✅ **Operating Hours**

### Media Assets

- ✅ **Business Logo** (auto-uploaded to Google Cloud)
- ✅ **Cover Images** (high-quality photos)
- ✅ **Gallery Images** (up to 5 photos per business)
- ✅ **Public URLs** for fast loading

### Reviews & Ratings

- ✅ **Overall Rating** (1-5 stars)
- ✅ **Total Review Count**
- ✅ **Recent Reviews** (up to 5 per business)
- ✅ **Reviewer Names & Photos**
- ✅ **Review Text & Dates**

## 📊 Scraping Capabilities

### Volume

- **Thousands of businesses** per day
- **16 major cities** supported
- **8+ business categories**
- **Automatic deduplication**

### Performance

- **Rate-limited** to respect Google's API limits
- **Parallel processing** for efficiency
- **Auto-retry** on failures
- **Progress tracking** in real-time

### Quality

- **High-quality images** (800px+ resolution)
- **Verified business data** from Google
- **Recent reviews** and ratings
- **Accurate location** coordinates

## 🎛️ Admin Controls

### Scraper Dashboard

- **Real-time progress** tracking
- **Live statistics** (businesses found, cities covered)
- **Job history** and logs
- **Data export** functionality

### Configuration Options

- **City selection** (16 major Indian cities)
- **Category filtering** (visa consultants, lawyers, agencies)
- **Results per search** (10-20 businesses)
- **Delay settings** (respect API limits)

### Data Management

- **View scraped data** in organized tables
- **Delete unwanted** entries
- **Export to JSON** for backup
- **Search & filter** capabilities

## 💰 Cost Estimation

### Google Places API Pricing

- **Text Search**: $32 per 1,000 requests
- **Place Details**: $17 per 1,000 requests
- **Photos**: $7 per 1,000 requests

### Example Cost (1,000 businesses)

- Search requests: ~$32
- Details requests: ~$17
- Photo downloads: ~$35
- **Total: ~$84** for 1,000 complete business profiles

### Cost Optimization

- ✅ **Smart caching** prevents duplicate requests
- ✅ **Batch processing** maximizes efficiency
- ✅ **Rate limiting** prevents overuse
- ✅ **Selective scraping** by city/category

## 🛡️ Best Practices

### API Usage

1. **Respect rate limits** (1-2 requests/second)
2. **Cache results** to avoid duplicate calls
3. **Monitor API quotas** in Google Cloud Console
4. **Use specific search terms** for better results

### Data Quality

1. **Review scraped data** before publishing
2. **Verify business information** periodically
3. **Update old listings** regularly
4. **Remove closed businesses**

### Legal Compliance

1. **Respect robots.txt** and terms of service
2. **Don't scrape excessively** from single sources
3. **Provide attribution** where required
4. **Respect privacy** in reviews and photos

## 🚀 Getting Started Examples

### Quick Start (10 Visa Consultants in Delhi)

```
Cities: Delhi
Categories: visa consultant
Max Results: 10
Expected Time: ~5 minutes
Expected Cost: ~$5
```

### Medium Scale (Immigration Services in Top 5 Cities)

```
Cities: Delhi, Mumbai, Bangalore, Chennai, Hyderabad
Categories: immigration lawyer, visa consultant
Max Results: 15 per search
Expected Time: ~30 minutes
Expected Cost: ~$40
```

### Large Scale (All Categories in All Cities)

```
Cities: All 16 cities
Categories: All 8 categories
Max Results: 20 per search
Expected Time: ~2 hours
Expected Cost: ~$200
Expected Businesses: ~2,000+
```

## 🔧 Troubleshooting

### Common Issues

**API Key Invalid**

- Check if Places API is enabled
- Verify API key restrictions
- Ensure billing is enabled

**Low Results**

- Try different search terms
- Expand search radius
- Check if businesses exist in that city

**Quota Exceeded**

- Monitor usage in Google Cloud Console
- Increase quotas if needed
- Implement better rate limiting

### Success Indicators

- ✅ Business names are relevant
- ✅ Phone numbers are Indian format
- ✅ Images are downloading successfully
- ✅ Reviews are recent and real
- ✅ Locations are in correct cities

Your automated business data collection system is ready! Start with a small test (10-20 businesses) to verify everything works before scaling up.
