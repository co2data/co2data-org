#!/usr/bin/env bash
set -e

# Function to kill Next.js processes
kill_next_processes() {
  pkill -f "next start" 2>/dev/null || true
  pkill -f "next-server" 2>/dev/null || true
  fuser -k 3000/tcp 2>/dev/null || true
}

# Cleanup function to ensure server is killed on exit
cleanup() {
  echo "🧹 Cleaning up..."
  if [ ! -z "$SERVER_PID" ]; then
    kill $SERVER_PID 2>/dev/null || true
    sleep 1
  fi
  kill_next_processes
  rm -f ./e2e-test.db
}

# Set trap to call cleanup on script exit (success or failure)
trap cleanup EXIT INT TERM

# Set CI environment variable
export CI=true

# Set dummy session password for E2E tests (not used in production)
export SESSION_PASSWORD=${SESSION_PASSWORD:-"test-session-password-for-e2e-only-min-32-chars-long"}
# Set base url
export BASE_URL="https://co2data.org"

# Cache Playwright browsers in a persistent directory
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-/var/cache/playwright}"
mkdir -p "$PLAYWRIGHT_BROWSERS_PATH"

echo "🚀 Starting Coolify build process..."

# Kill any existing Next.js server processes
echo "🔍 Checking for existing Next.js processes..."
kill_next_processes
sleep 2

# Linting code
echo "📏 Linting code..."
biome ci app domain adapter lib

# Run unit tests
echo "🧪 Running unit tests..."
pnpm test:ci

# Build the application
echo "🏗️  Building application..."
pnpm build

# Clean up old test database if it exists
if [ -f "./e2e-test.db" ]; then
  echo "🧹 Removing old test database..."
  rm -f ./e2e-test.db
fi

# Seed E2E test database
echo "🌱 Seeding E2E test database..."
DB_URL="file:./e2e-test.db" pnpm seed:e2e

# Install Playwright browsers (only Chromium to save resources)
echo "🎭 Checking Playwright browsers cache..."
if pnpm exec playwright install chromium --dry-run 2>&1 | grep -q "is already installed"; then
  echo "✓ Playwright Chromium already cached at $PLAYWRIGHT_BROWSERS_PATH, skipping..."
else
  echo "📦 Installing Playwright Chromium to cache..."
  pnpm exec playwright install --with-deps chromium
fi

# Kill any processes that might have started during seeding
echo "🔍 Ensuring port 3000 is free before starting server..."
kill_next_processes
sleep 2

# Start the app in the background for E2E tests
echo "🌐 Starting production server for E2E tests..."
DB_URL="file:./e2e-test.db" pnpm start >/tmp/next-server.log 2>&1 &
SERVER_PID=$!

# Give server a moment to start or fail
sleep 2

# Check if server process is still running
if ! kill -0 $SERVER_PID 2>/dev/null; then
  echo "❌ Server failed to start. Check logs:"
  cat /tmp/next-server.log
  exit 1
fi

# Wait for server to be ready
echo "⏳ Waiting for server to be ready..."
npx wait-on http://localhost:3000 -t 60000 || {
  echo "❌ Server failed to start"
  exit 1
}

# Run E2E tests
echo "🧪 Running E2E tests..."
pnpm test:e2e --project=chromium

echo "✅ Build completed successfully!"
