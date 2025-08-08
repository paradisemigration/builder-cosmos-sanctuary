# Render Deployment Guide

## Database Options for Render

### Option 1: PostgreSQL (Recommended)

Render offers managed PostgreSQL databases which are perfect for production.

**Steps:**

1. Create a PostgreSQL database in Render dashboard
2. Install PostgreSQL adapter: `npm install pg`
3. Update database connection to use PostgreSQL instead of SQLite
4. Migrate your SQLite data to PostgreSQL

### Option 2: External Database Services

Connect to external managed databases:

**Neon (Recommended)**

- Serverless PostgreSQL
- Generous free tier
- Auto-scaling

**Supabase**

- PostgreSQL with real-time features
- Built-in authentication
- Free tier available

**PlanetScale**

- MySQL-compatible
- Serverless scaling
- Free tier available

### Option 3: Keep SQLite (Not Recommended)

While SQLite works on Render, it has limitations:

- Single file storage
- No concurrent writes
- Not suitable for high traffic

## Deployment Commands for Render

```bash
# Build command
npm install && npm run build

# Start command
npm start
```

## Environment Variables

Set these in Render dashboard:

- `NODE_ENV=production`
- `DATABASE_URL=your_database_connection_string`
- Any other environment variables from .env

## Current Project Status

- ✅ Load More button blinking fixed
- ✅ Browse page data loading works
- 📊 Database: 1,572 businesses, 7,707 reviews, 1,926 images
- 🔄 Ready for PostgreSQL migration if needed

## Next Steps

1. Choose database option (PostgreSQL recommended)
2. Set up Render service
3. Configure environment variables
4. Deploy!
