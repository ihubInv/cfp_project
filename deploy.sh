#!/bin/bash

# Deployment script for cfpihubiitmandi.cloud
# This script builds the frontend and restarts services

set -e

echo "🚀 Starting deployment for cfpihubiitmandi.cloud..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to project directory
cd /root/Fariyad/cfp_project

# Build frontend
echo -e "${YELLOW}📦 Building frontend...${NC}"
cd frontend
npm run build
echo -e "${GREEN}✅ Frontend build completed${NC}"

# Copy build to web directory
echo -e "${YELLOW}📁 Copying build to web directory...${NC}"
mkdir -p /var/www/cfpihubiitmandi
cp -r build/* /var/www/cfpihubiitmandi/
chown -R www-data:www-data /var/www/cfpihubiitmandi
echo -e "${GREEN}✅ Build files copied${NC}"

# Restart backend (if using PM2 or systemd)
echo -e "${YELLOW}🔄 Restarting backend...${NC}"
cd ../backend
# Uncomment the appropriate line based on your process manager:
# pm2 restart backend || pm2 start npm --name "backend" -- run dev
# systemctl restart backend
# Or manually: pkill -f "node.*app.js" && npm run dev > /dev/null 2>&1 &

echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
nginx -t && systemctl reload nginx || service nginx reload
echo -e "${GREEN}✅ Nginx reloaded${NC}"

echo -e "${GREEN}✨ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your site should be available at: http://cfpihubiitmandi.cloud${NC}"
