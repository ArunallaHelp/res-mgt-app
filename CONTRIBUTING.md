# Contributing to Arunalla

First off, thank you for considering contributing to Arunalla! It's people like you that make Arunalla such a great tool.

## Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher.
- **Package Manager**: We recommend using [pnpm](https://pnpm.io/), but `npm` is also supported.
- **Supabase CLI**: For local database development (optional but recommended).

### Installation

1. **Fork the repository** on GitHub.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/v0-flood-relief-education-app.git
   cd v0-flood-relief-education-app
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   # or
   npm install
   ```

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in the environment variables in `.env.local`. You will need Supabase credentials.
   - See [README.env.md](./README.env.md) for detailed instructions on where to find these values.

## Development Workflow

1. **Start the development server**:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Database

This project uses [Supabase](https://supabase.com/).

- If you are making changes to the database schema, please use the Supabase CLI to generate migrations.
- Ensure your local environment variables are pointing to the correct Supabase project (local or remote).

## Testing

We use [Playwright](https://playwright.dev/) for end-to-end testing.

To run the tests:

```bash
npx playwright test
```

To run the tests in UI mode:

```bash
npx playwright test --ui
```

Please ensure all tests pass before submitting a pull request.

## Code Style

- We use **ESLint** to maintain code quality.
- Run the linter before committing:
  ```bash
  pnpm lint
  # or
  npm run lint
  ```

## Submitting a Pull Request

1. **Create a new branch** for your feature or bugfix:
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/critical-bug
   ```
2. **Commit your changes** with clear and descriptive messages.
3. **Push your branch** to your fork:
   ```bash
   git push origin feature/amazing-feature
   ```
4. **Open a Pull Request** against the `main` branch of the original repository.
5. Provide a clear description of the changes and link to any relevant issues.

## License

By contributing, you agree that your contributions will be licensed under the project's license.
