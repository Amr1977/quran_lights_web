#!/bin/bash

# Deploy Firebase Security Rules
echo "Deploying Firebase security rules..."

# Check if firebase-tools is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Deploy the rules
firebase deploy --only database

echo "Firebase rules deployed successfully!"
echo ""
echo "Next steps:"
echo "1. Test the review submission form on your website"
echo "2. Access the admin panel at: https://your-domain.com/admin-reviews.html"
echo "3. Approve or reject reviews as needed"
echo ""
echo "Note: Make sure to secure the admin panel in production!" 