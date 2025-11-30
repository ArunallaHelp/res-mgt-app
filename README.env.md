# Environment Setup Guide

## Required Environment Variables

This application requires Supabase configuration to function properly. Follow these steps to set up your environment:

### 1. Create a Supabase Project

If you haven't already:

1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the project to be provisioned

### 2. Get Your Supabase Credentials

1. Navigate to your project settings: `https://app.supabase.com/project/YOUR_PROJECT_ID/settings/api`
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **Anon/Public Key** (under "Project API keys" → "anon public")

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace the placeholder values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/request/verify/details
   ```

### 4. Environment Variables Explained

| Variable                                | Description                                              | Required    |
| --------------------------------------- | -------------------------------------------------------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`              | Your Supabase project URL                                | ✅ Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`         | Your Supabase anonymous/public API key                   | ✅ Yes      |
| `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` | Custom redirect URL for email verification (development) | ❌ Optional |

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put sensitive secrets in these variables.

### 5. Restart Your Development Server

After updating `.env.local`, restart your development server:

```bash
npm run dev
```

## Security Notes

- **Never commit `.env.local`** to version control (it's already in `.gitignore`)
- The `.env.example` file is safe to commit as it contains no real credentials
- For production deployments, set these environment variables in your hosting platform (e.g., Vercel)

## Troubleshooting

### "Invalid API key" or "Project not found"

- Double-check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Ensure there are no extra spaces or quotes in your `.env.local` file

### Changes not taking effect

- Restart your development server after modifying `.env.local`
- Clear your browser cache and cookies

### Email verification not working

- Check that `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` is set correctly
- Verify your Supabase email templates are configured properly in the Supabase dashboard
