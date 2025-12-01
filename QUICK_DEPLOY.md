# Quick Deploy to Cloud Run

## Prerequisites Checklist

- [ ] Google Cloud Project created with billing enabled
- [ ] `gcloud` CLI installed and authenticated
- [ ] `.env.local` file with all environment variables
- [ ] `GCP_PROJECT_ID` added to `.env.local`

## One-Time Setup

```bash
# 1. Login to Google Cloud
gcloud auth login

# 2. Set your project
gcloud config set project YOUR_PROJECT_ID

# 3. Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com
```

## Deploy (PowerShell - Windows)

```powershell
.\deploy.ps1
```

## Deploy (Bash - Linux/Mac)

```bash
chmod +x deploy.sh
./deploy.sh
```

## What the Deployment Script Does

1. ✅ Reads all environment variables from `.env.local`
2. ✅ Submits build to Google Cloud Build
3. ✅ Builds Docker image with your environment variables
4. ✅ Pushes image to Google Container Registry
5. ✅ Deploys to Cloud Run in `asia-south1` region
6. ✅ Returns the public URL of your deployed app

## Important Notes

- **Environment Variables**: All variables from `.env.local` are used during build and runtime
- **Public Access**: The app is deployed with `--allow-unauthenticated` (public)
- **Region**: Default is `asia-south1` (change in scripts if needed)
- **Auto-scaling**: Cloud Run will auto-scale based on traffic

## After First Deployment

1. Get your Cloud Run URL:

   ```bash
   gcloud run services describe flood-relief-education-app --region=asia-south1 --format='value(status.url)'
   ```

2. Update `.env.local` with the actual URL:

   ```env
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-actual-url.run.app/request/verify/details
   ```

3. Redeploy to use the correct redirect URL

## View Logs

```bash
gcloud run services logs read flood-relief-education-app --region=asia-south1 --limit=50
```

## Full Documentation

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed information, troubleshooting, and advanced options.
