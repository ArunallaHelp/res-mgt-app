# Arunalu

_Automatically synced with your [v0.app](https://v0.app) deployments_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/syigen/v0-flood-relief-education-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/lOvjtmATEzm)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Environment Setup

This application requires environment variables to connect to Supabase. Follow these steps:

1. **Copy the environment template:**

   ```bash
   cp .env.example .env.local
   ```

2. **Get your Supabase credentials:**

   - Go to your [Supabase Dashboard](https://app.supabase.com)
   - Navigate to Project Settings → API
   - Copy your Project URL and anon/public key

3. **Update `.env.local`** with your actual credentials

📖 **For detailed setup instructions, see [README.env.md](./README.env.md)**

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Your project is live at:

**[https://vercel.com/syigen/v0-flood-relief-education-app](https://vercel.com/syigen/v0-flood-relief-education-app)**

### Deploy to Vercel

When deploying to Vercel, make sure to add your environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Build your app

Continue building your app on:

**[https://v0.app/chat/lOvjtmATEzm](https://v0.app/chat/lOvjtmATEzm)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI Components:** Radix UI + Custom Components
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** Supabase
- **Deployment:** Vercel
