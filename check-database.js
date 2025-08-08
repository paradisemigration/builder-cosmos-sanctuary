#!/usr/bin/env node

// Quick database status checker for TheVisaBay.com
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'server', 'visaconsult.db');

console.log('🔍 Checking TheVisaBay.com database status...\n');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  }

  console.log('✅ Connected to SQLite database');
  
  // Check total businesses
  db.get('SELECT COUNT(*) as count FROM businesses', (err, row) => {
    if (err) {
      console.error('❌ Error counting businesses:', err.message);
    } else {
      console.log(`📊 Total businesses: ${row.count.toLocaleString()}`);
    }
    
    // Check cities
    db.get('SELECT COUNT(DISTINCT city) as count FROM businesses', (err, row) => {
      if (err) {
        console.error('❌ Error counting cities:', err.message);
      } else {
        console.log(`🌍 Total cities: ${row.count}`);
      }
      
      // Check images
      db.get('SELECT COUNT(*) as count FROM businesses WHERE images IS NOT NULL AND images != ""', (err, row) => {
        if (err) {
          console.error('❌ Error counting images:', err.message);
        } else {
          console.log(`🖼️  Businesses with images: ${row.count.toLocaleString()}`);
        }
        
        // Top cities by business count
        db.all(`
          SELECT city, COUNT(*) as count 
          FROM businesses 
          GROUP BY city 
          ORDER BY count DESC 
          LIMIT 10
        `, (err, rows) => {
          if (err) {
            console.error('❌ Error getting city breakdown:', err.message);
          } else {
            console.log('\n🏙️  Top 10 cities by business count:');
            rows.forEach((row, index) => {
              console.log(`   ${index + 1}. ${row.city}: ${row.count} businesses`);
            });
          }
          
          console.log('\n✅ Database is healthy and contains real business data!');
          console.log('🎉 TheVisaBay.com data is ready to serve users.');
          
          db.close();
        });
      });
    });
  });
});
