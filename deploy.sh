#!/bin/bash

# Deployment script for Cloud Run
# This script reads environment variables from .env.local and deploys to Cloud Run

set -e

echo "🚀 Deploying to Google Cloud Run..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    exit 1
fi

# Load environment variables from .env.local
export $(grep -v '^#' .env.local | xargs)

# Set your GCP project ID
PROJECT_ID="${GCP_PROJECT_ID:-your-project-id}"
SERVICE_NAME="flood-relief-education-app"
REGION="asia-south1"

echo "📦 Project: $PROJECT_ID"
echo "🌍 Region: $REGION"
echo "🏷️  Service: $SERVICE_NAME"

# Verify required environment variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo "❌ Error: Required environment variables not found in .env.local"
    echo "   Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set"
    exit 1
fi

# Option 1: Deploy using Cloud Build (recommended)
echo ""
echo "Deploying using Cloud Build..."
gcloud builds submit \
    --config=cloudbuild.yaml \
    --project="$PROJECT_ID" \
    --substitutions="\
_NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,\
_NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY,\
_NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=$NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL,\
_SERVICE_NAME=$SERVICE_NAME,\
_REGION=$REGION"

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should be available at:"
echo "   https://$SERVICE_NAME-<hash>-$REGION.run.app"
