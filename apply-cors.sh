#!/bin/bash

# Apply CORS configuration to Firebase Storage bucket
# Requires authentication with Google Cloud first

echo "To fix CORS issue, run these commands:"
echo ""
echo "1. Install Google Cloud CLI:"
echo "   curl https://sdk.cloud.google.com | bash"
echo "   exec -l \$SHELL"
echo ""
echo "2. Authenticate:"
echo "   gcloud auth login"
echo "   gcloud config set project autohunter-pro"
echo ""
echo "3. Apply CORS:"
echo "   gcloud storage buckets update gs://autohunter-pro.firebasestorage.app --cors-file=firebase-storage-cors.json"
echo ""
echo "Or apply via Firebase Console:"
echo "   1. Go to https://console.cloud.google.com/storage"
echo "   2. Select autohunter-pro project"
echo "   3. Click on autohunter-pro.firebasestorage.app bucket"
echo "   4. Go to Permissions tab"
echo "   5. Add allUsers with Storage Object Viewer role"