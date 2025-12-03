# Arunalla

## Overview

Arunalla is a flood relief education support application designed to help students and educators during times of crisis.

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

📖 **For detailed setup instructions, see [.env.example](./.env.example)**

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework:** Next.js 16 with App Router
- **UI Components:** Radix UI + Custom Components
- **Styling:** Tailwind CSS
- **Authentication:** Supabase Auth
- **Database:** Supabase

## Contributing

We welcome contributions to Arunalla! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to get started, our development workflow, and code of conduct.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.
