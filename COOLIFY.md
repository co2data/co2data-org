# Coolify Build Configuration

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
- `DB_URL` is set to a test SQLite database for E2E tests
- For production deployment, make sure to set your actual `SESSION_PASSWORD` and `DB_URL` environment variables in Coolify

### 3. Build Process

The build script will automatically:
1. Kill any existing Next.js processes on port 3000
2. Install pnpm dependencies
3. Install Playwright browsers (Chromium only for efficiency)
4. Run unit tests (vitest)
5. Build the Next.js application
6. Seed a test SQLite database with sample data for E2E tests
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
- E2E tests run on Chromium only by default (faster, less resource-intensive)
- The reporter is set to 'list' in CI mode for cleaner output
- Build will fail if any test fails, preventing bad deployments
- The script automatically kills any lingering Next.js processes before starting
- Test database is automatically cleaned up after tests complete
- Unit tests use in-memory databases to avoid conflicts with E2E test database
