# Script to update Cloud Build trigger with environment variables from .env.local

Write-Host "Reading environment variables from .env.local..." -ForegroundColor Cyan

# Load environment variables from .env.local
Get-Content .env.local | Where-Object { $_ -notmatch '^#' -and $_ -match '=' } | ForEach-Object {
    $parts = $_ -split '=', 2
    $key = $parts[0].Trim()
    $value = $parts[1].Trim()
    [Environment]::SetEnvironmentVariable($key, $value, 'Process')
}

$TRIGGER_NAME = "rmgpgab-v0-flood-relief-education-app-europe-west1-dewmal-v0pnk"
$REGION = "europe-west1"

Write-Host ""
Write-Host "Environment Variables:" -ForegroundColor Yellow
Write-Host "  SUPABASE_URL: $env:NEXT_PUBLIC_SUPABASE_URL"
Write-Host "  SUPABASE_ANON_KEY: $($env:NEXT_PUBLIC_SUPABASE_ANON_KEY.Substring(0,20))..."
Write-Host "  REDIRECT_URL: $env:NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL"
Write-Host ""

# Verify environment variables are set
if (-not $env:NEXT_PUBLIC_SUPABASE_URL -or -not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "Error: Required environment variables not found in .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "Updating Cloud Build trigger: $TRIGGER_NAME" -ForegroundColor Green

# Define substitution variables as local variables
$NEXT_PUBLIC_SUPABASE_URL = $env:NEXT_PUBLIC_SUPABASE_URL
$NEXT_PUBLIC_SUPABASE_ANON_KEY = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
$NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL = $env:NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL

# Update the trigger with substitution variables
gcloud builds triggers update $TRIGGER_NAME `
    --region=$REGION `
    --update-substitutions="_NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,_NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY,_NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=$NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Successfully updated trigger with environment variables!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can view the trigger at:" -ForegroundColor Cyan
    Write-Host "https://console.cloud.google.com/cloud-build/triggers/edit/$TRIGGER_NAME?project=edusupport-b89a4" -ForegroundColor Cyan
}
else {
    Write-Host ""
    Write-Host "Failed to update trigger" -ForegroundColor Red
    exit 1
}
