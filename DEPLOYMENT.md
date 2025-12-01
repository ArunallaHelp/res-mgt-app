# Cloud Run Deployment Guide

This guide explains how to deploy the Flood Relief Education App to Google Cloud Run.

## Prerequisites

1. **Google Cloud Project**: You need a GCP project with billing enabled
2. **gcloud CLI**: Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Not required if using Cloud Build
4. **Environment Variables**: Your `.env.local` file with all required variables

## Required Environment Variables

Your `.env.local` should contain at least:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://your-app-url.run.app/request/verify/details
GCP_PROJECT_ID=your-gcp-project-id
```

## Initial Setup

### 1. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Enable Required APIs

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Update `.env.local`

Add your GCP project ID to `.env.local`:

```env
GCP_PROJECT_ID=your-actual-project-id
```

## Deployment Methods

### Method 1: Using the Deployment Script (Recommended)

#### On Windows (PowerShell):

```powershell
.\deploy.ps1
```

#### On Linux/Mac (Bash):

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:

- ✅ Read environment variables from `.env.local`
- ✅ Build the Docker image using Cloud Build
- ✅ Deploy to Cloud Run with all environment variables
- ✅ Display the deployment URL

### Method 2: Manual Deployment with Cloud Build

```bash
# Load environment variables from .env.local
export $(grep -v '^#' .env.local | xargs)

# Submit build to Cloud Build
gcloud builds submit \
  --config=cloudbuild.yaml \
  --project="$GCP_PROJECT_ID" \
  --substitutions="\
_NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,\
_NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY,\
_NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=$NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL"
```

### Method 3: Direct gcloud Deploy (Alternative)

```bash
# Load environment variables
export $(grep -v '^#' .env.local | xargs)

# Build and deploy in one command
gcloud run deploy flood-relief-education-app \
  --source . \
  --region=asia-south1 \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY,NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=$NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL"
```

## Configuration Details

### Cloud Build Configuration

The `cloudbuild.yaml` file defines three steps:

1. **Build**: Creates a Docker image with environment variables as build arguments
2. **Push**: Uploads the image to Google Container Registry
3. **Deploy**: Deploys the image to Cloud Run with runtime environment variables

### Dockerfile

The multi-stage Dockerfile:

- Uses Node.js 20 Alpine for small image size
- Installs dependencies with pnpm
- Builds the Next.js app with standalone output
- Creates a production-ready image with minimal footprint
- Runs as non-root user for security

### Environment Variables

Environment variables are set in two places:

1. **Build Time** (via `--build-arg`): Required for Next.js public variables during build
2. **Runtime** (via `--set-env-vars`): Available to the running container

## Post-Deployment

### Get the Service URL

```bash
gcloud run services describe flood-relief-education-app \
  --region=asia-south1 \
  --format='value(status.url)'
```

### Update Supabase Redirect URL

After first deployment, update your `.env.local` with the actual Cloud Run URL:

```env
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=https://flood-relief-education-app-xxxxx-uc.a.run.app/request/verify/details
```

Then redeploy to use the correct redirect URL.

### View Logs

```bash
gcloud run services logs read flood-relief-education-app \
  --region=asia-south1 \
  --limit=50
```

### Update the Service

To update the deployed service, simply run the deployment script again. Cloud Run will create a new revision and gradually shift traffic.

## Troubleshooting

### Build Fails

- Check that all environment variables are set in `.env.local`
- Verify Cloud Build API is enabled
- Check Cloud Build logs: `gcloud builds list --limit=5`

### Deployment Fails

- Ensure Cloud Run API is enabled
- Check service account permissions
- Verify the image was pushed to Container Registry

### Runtime Errors

- Check Cloud Run logs for errors
- Verify environment variables are correctly set
- Ensure Supabase URL and keys are valid

## Cost Optimization

Cloud Run pricing is based on:

- **CPU and Memory**: Only charged when handling requests
- **Requests**: Number of requests served
- **Networking**: Egress traffic

To optimize costs:

- Use the minimum required CPU/memory (default: 1 CPU, 512MB)
- Set `--min-instances=0` for testing (auto-scale to zero)
- Set `--max-instances=10` to limit scaling

Example with cost optimization:

```bash
gcloud run deploy flood-relief-education-app \
  --image=gcr.io/$PROJECT_ID/flood-relief-education-app:latest \
  --region=asia-south1 \
  --min-instances=0 \
  --max-instances=10 \
  --cpu=1 \
  --memory=512Mi
```

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use Secret Manager** for sensitive data (optional):
   ```bash
   gcloud secrets create supabase-anon-key --data-file=<(echo -n "$NEXT_PUBLIC_SUPABASE_ANON_KEY")
   ```
3. **Review IAM permissions** for the service account
4. **Enable VPC** if accessing private resources

## Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
