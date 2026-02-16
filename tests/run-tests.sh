#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

# Load .env if present (check tests dir, then repo root)
if [ -f .env ]; then
  set -a
  source .env
  set +a
elif [ -f ../.env ]; then
  set -a
  source ../.env
  set +a
fi

if [ -z "${OPENAI_API_KEY:-}" ]; then
  echo "Error: OPENAI_API_KEY is not set"
  exit 1
fi

COMPOSE="docker compose -f docker-compose.test.yml"

# Discover test services dynamically (every service named test-*)
test_services=($($COMPOSE config --services | grep '^test-' | sort))

if [ ${#test_services[@]} -eq 0 ]; then
  echo "No test services found in docker-compose.test.yml"
  exit 1
fi

echo "Building and running tests..."
echo "Test services: ${test_services[*]}"
echo ""

# Build all images first
$COMPOSE build 2>&1

# Start mock-api and wait for it to be healthy
$COMPOSE up -d mock-api 2>&1
echo "Waiting for mock-api to be healthy..."
$COMPOSE up -d --wait mock-api 2>&1

# Run all test containers in parallel, let them all complete
$COMPOSE up --no-build "${test_services[@]}" 2>&1 || true

echo ""
echo "════════════════════════════════"
echo "  Test Results"
echo "════════════════════════════════"

failed=0

for name in "${test_services[@]}"; do
  code=$($COMPOSE ps -a "$name" --format '{{.ExitCode}}' 2>/dev/null || echo "1")
  if [ "$code" = "0" ]; then
    echo "  PASS  $name"
  else
    echo "  FAIL  $name (exit code: $code)"
    failed=1
  fi
done

echo "════════════════════════════════"

# Cleanup
$COMPOSE down --volumes --remove-orphans > /dev/null 2>&1

if [ "$failed" = "1" ]; then
  echo ""
  echo "Some tests failed."
  exit 1
fi

echo ""
echo "All tests passed!"
