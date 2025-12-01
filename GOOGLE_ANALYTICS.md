# Google Analytics Setup

This application is configured to use Google Analytics 4 (GA4) for tracking user interactions and page views.

## Setup Instructions

### 1. Create a Google Analytics Property

If you don't already have a Google Analytics 4 property:

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click **Admin** (gear icon in the bottom left)
3. Under **Property**, click **Create Property**
4. Follow the setup wizard to create your GA4 property
5. Once created, go to **Admin** → **Data Streams**
6. Click on your web data stream
7. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Add Measurement ID to Environment Variables

Add your Google Analytics Measurement ID to your `.env.local` file:

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. For Production Deployment

When deploying to Google Cloud Run:

1. **Add the Measurement ID to `.env.local`** (if not already added)

2. **Update the Cloud Build trigger** using the provided script:

   ```powershell
   .\update-trigger.ps1
   ```

   This will automatically read all environment variables from `.env.local` and update your Cloud Build trigger with the necessary substitution variables, including the GA Measurement ID.

3. **Deploy your application**:
   ```powershell
   .\deploy.ps1
   ```

## How It Works

- The `GoogleAnalytics` component in `components/google-analytics.tsx` loads the GA4 tracking script
- The component is included in the root layout (`app/layout.tsx`)
- It automatically tracks page views and user interactions
- If `NEXT_PUBLIC_GA_MEASUREMENT_ID` is not set, the component won't render (no analytics in development if not configured)

## Verifying Analytics

After deployment:

1. Visit your deployed application
2. Navigate to different pages
3. Go to your [Google Analytics](https://analytics.google.com/) dashboard
4. Click **Reports** → **Realtime** to see live user activity
5. Check **Reports** → **Engagement** → **Pages and screens** to see page view data

## Privacy Considerations

- Google Analytics complies with GDPR when configured correctly
- Consider adding a cookie consent banner if required in your jurisdiction
- Review Google's [privacy documentation](https://support.google.com/analytics/answer/6004245) for best practices

## Troubleshooting

**Analytics not showing data:**

- Verify the Measurement ID is correct
- Check browser console for errors
- Make sure you're not blocking analytics with an ad blocker
- Wait 24-48 hours for initial data to appear in reports (Realtime should work immediately)

**Environment variable not being picked up:**

- Restart your development server after adding the variable
- For production, make sure you've run `update-trigger.ps1` and redeployed
- Verify the variable is present in your Cloud Run service's environment variables
