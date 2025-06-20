#!/bin/bash

# Deployment script for Next.js app on Hostinger Node.js hosting

# Step 1: Build the Next.js app for production
echo "Building Next.js app for production..."
npm install
npm run build

# Step 2: Start the app using pm2 or node (pm2 recommended for production)
# Check if pm2 is installed, install if not
if ! command -v pm2 &> /dev/null
then
    echo "pm2 not found, installing pm2 globally..."
    npm install -g pm2
fi

# Step 3: Stop existing pm2 process if running
pm2 delete next-app || true

# Step 4: Start the Next.js app with pm2
echo "Starting Next.js app with pm2..."
pm2 start npm --name "next-app" -- start

# Step 5: Save pm2 process list and enable startup on server reboot
pm2 save
pm2 startup

echo "Deployment complete. Your Next.js app should now be running on Hostinger."
echo "Use 'pm2 logs next-app' to view logs and 'pm2 stop next-app' to stop the app."
