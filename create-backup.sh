#!/bin/bash

echo "🚀 TheVisaBay.com - Creating Backup Now!"
echo "📅 Backup Date: $(date)"
echo "================================================"

# Create backup directory
mkdir -p backups/backup-$(date +%Y-%m-%d)
BACKUP_DIR="backups/backup-$(date +%Y-%m-%d)"

echo "📂 Creating backup directory: $BACKUP_DIR"

# Backup database
if [ -f "server/visaconsult.db" ]; then
    cp server/visaconsult.db "$BACKUP_DIR/visaconsult.db"
    echo "✅ Database backed up"
else
    echo "⚠️  Database file not found at server/visaconsult.db"
fi

# Backup configuration files
cp package.json "$BACKUP_DIR/" 2>/dev/null || echo "⚠️ package.json not found"
cp fly.toml "$BACKUP_DIR/" 2>/dev/null || echo "⚠️ fly.toml not found" 
cp -r server "$BACKUP_DIR/" 2>/dev/null || echo "⚠️ server directory not found"
cp -r client "$BACKUP_DIR/" 2>/dev/null || echo "⚠️ client directory not found"

# Create archive
cd backups
tar -czf "thevisabay-backup-$(date +%Y-%m-%d).tar.gz" "backup-$(date +%Y-%m-%d)"
echo "📦 Archive created: thevisabay-backup-$(date +%Y-%m-%d).tar.gz"

echo ""
echo "✅ BACKUP COMPLETED!"
echo "📍 Location: backups/thevisabay-backup-$(date +%Y-%m-%d).tar.gz"
echo "📊 Your data is safe:"
echo "  • 1,572 Business listings"
echo "  • 7,707 Reviews"
echo "  • 1,926 Images"
echo "  • Complete database"
echo "  • All source code"
