# PowerShell deployment script for Cloud Run
# This script reads environment variables from .env.local and deploys to Cloud Run

Write-Host "Deploying to Google Cloud Run..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path .env.local)) {
    Write-Host "Error: .env.local file not found!" -ForegroundColor Red
    exit 1
}

# Load environment variables from .env.local
Get-Content .env.local | Where-Object { $_ -notmatch '^#' -and $_ -match '=' } | ForEach-Object {
    $parts = $_ -split '=', 2
    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    [Environment]::SetEnvironmentVariable($key, $value, 'Process')
}

# Set your GCP project ID
$PROJECT_ID = if ($env:GCP_PROJECT_ID) { $env:GCP_PROJECT_ID } else { "edusupport-b89a4" }
$SERVICE_NAME = "v0-flood-relief-education-app"
$REGION = "europe-west1"

Write-Host "Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "Region: $REGION" -ForegroundColor Yellow
Write-Host "Service: $SERVICE_NAME" -ForegroundColor Yellow

# Verify required environment variables
if (-not $env:NEXT_PUBLIC_SUPABASE_URL -or -not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "Error: Required environment variables not found in .env.local" -ForegroundColor Red
    Write-Host "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set" -ForegroundColor Red
    exit 1
}

# Deploy using Cloud Build
Write-Host ""
Write-Host "Deploying using Cloud Build..." -ForegroundColor Green

$substitutions = "_NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL," +
"_NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY," +
"_NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=$env:NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL," +
"_SERVICE_NAME=$SERVICE_NAME," +
"_REGION=$REGION"

gcloud builds submit `
    --config=cloudbuild.yaml `
    --project="$PROJECT_ID" `
    --substitutions="$substitutions"

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green
Write-Host "Your app should be available soon" -ForegroundColor Cyan
Write-Host "Run this command to get the URL:" -ForegroundColor Cyan
Write-Host "gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)'" -ForegroundColor Yellow
