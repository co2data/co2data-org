# Coolify Build Configuration

## Railpack: pnpm native module workaround

Railpack (as of Coolify's current version) installs pnpm as a **standalone
binary via mise**. That binary can run against an embedded Node that differs
from the project's Node 24 (this previously happened with pnpm 8/10: pnpm 8 ran
on Node 18.5.0, pnpm 10 on Node 20.11.1). During
`pnpm install --frozen-lockfile` it silently skips optional native packages
whose `engines` don't match the reported Node — which can drop
`@rolldown/binding-linux-x64-gnu` (needed by vite/vitest), `sharp`,
and `@tailwindcss/oxide-*`, and break the build with:

```
Error: Cannot find native binding.
Cannot find module '@rolldown/binding-linux-x64-gnu'
```

`railpack.json` avoids any doubt by installing pnpm **on the real Node 24** via
npm and running the frozen install with that pnpm. The pinned pnpm version
(pnpm 12.x, matching `packageManager` in `package.json` and `pnpm_12` in
`flake.nix`) must be updated in all three places together. If Railpack changes
the install step again, revisit this file.

## Setup Instructions

### 1. Configure Build Command

In your Coolify project settings, set the build command to:

```bash
./scripts/coolify-build.sh
```

Or if you want to skip E2E tests during build:

```bash
pnpm install && pnpm build
```

### 2. Required Environment Variables

No environment variables are required for the build process!

**Note**: 
- `CI=true` is automatically set by the build script
- `SESSION_PASSWORD` is set to a dummy value for E2E tests in the build script
- `BASE_URL` is set to "https://co2data.org" by the build script
- `DB_URL` is set to a test SQLite database for E2E tests
- For production deployment, make sure to set your actual `SESSION_PASSWORD` and `DB_URL` environment variables in Coolify

### 3. Build Process

The build script will automatically:
1. Kill any existing Next.js processes on port 3000
2. Lint the code using Biome (`biome ci`)
3. Run unit tests (vitest)
4. Build the Next.js application
5. Seed a test SQLite database with sample data for E2E tests
6. Install Playwright browsers (Chromium only, unless using Nix-provided browsers)
7. Start the production server with the test database
8. Run E2E tests against the production build
9. Clean up (kill server, remove test database)

### 4. Alternative: Skip E2E Tests During Build

If you want to run E2E tests separately (e.g., post-deploy), you can:

1. Use `pnpm build` as your build command instead
2. Set up a post-deploy webhook or cron job to run:
   ```bash
   pnpm test:e2e
   ```

### 5. Browser Selection

By default, the build script only runs tests on Chromium to save resources and time.

The script automatically detects if you're using Nix-provided Playwright browsers and skips installation in that case.

If you want to test all browsers, modify `scripts/coolify-build.sh` and remove `--project=chromium`

## Available Scripts

- `pnpm build` - Build the app (no tests)
- `pnpm build:with-tests` - Run all tests and build
- `pnpm test:ci` - Run unit tests
- `pnpm test:e2e` - Run E2E tests
- `pnpm test:e2e:install` - Install Playwright browsers
- `pnpm seed:e2e` - Seed E2E test database with sample data

## E2E Test Data

The build script automatically creates a test database (`e2e-test.db`) with sample data:
- Test user: `e2e-test-user`
- Category: `Food`
- CO2 Producer: `Pork` (referenced in E2E tests)
- Source data with CO2 emissions

You can modify the seed data in `scripts/seed-e2e-db.ts` to add more test data.

## Notes

- GitHub Actions Playwright workflow has been disabled (`.github/workflows/playwright.yml.disabled`)
- Code is linted with Biome before running tests
- Unit tests run before the build to catch errors early
- E2E tests run on Chromium only by default (faster, less resource-intensive)
- The script automatically detects and uses Nix-provided Playwright browsers when available
- The reporter is set to 'list' in CI mode for cleaner output
- Build will fail if linting, unit tests, or E2E tests fail, preventing bad deployments
- The script automatically kills any lingering Next.js processes before starting
- Test database is automatically cleaned up after tests complete
- Unit tests use in-memory databases to avoid conflicts with E2E test database
