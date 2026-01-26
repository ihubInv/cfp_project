#!/bin/bash
# Backend startup script

cd /root/Fariyad/cfp_project/backend

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
    echo "Starting backend with PM2..."
    pm2 start app.js --name "cfp-backend" --interpreter node
    pm2 save
    echo "Backend started with PM2. Use 'pm2 status' to check status."
else
    echo "PM2 not found. Starting backend with nohup..."
    nohup npm run dev > /tmp/backend.log 2>&1 &
    echo "Backend started. Logs: /tmp/backend.log"
fi
