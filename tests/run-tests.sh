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

echo "Building and running tests..."
echo ""

# Build all images first
$COMPOSE build 2>&1

# Start mock-api and wait for it to be healthy
$COMPOSE up -d mock-api 2>&1
echo "Waiting for mock-api to be healthy..."
$COMPOSE up -d --wait mock-api 2>&1

# Run all three test containers in parallel, let them all complete
$COMPOSE up --no-build test-openai test-vercel-ai-sdk test-langchain 2>&1 || true

echo ""
echo "════════════════════════════════"
echo "  Test Results"
echo "════════════════════════════════"

failed=0

for pair in "test-openai:OpenAI" "test-vercel-ai-sdk:Vercel AI SDK" "test-langchain:LangChain"; do
  name="${pair%%:*}"
  label="${pair#*:}"
  code=$($COMPOSE ps -a "$name" --format '{{.ExitCode}}' 2>/dev/null || echo "1")
  if [ "$code" = "0" ]; then
    echo "  PASS  $label"
  else
    echo "  FAIL  $label (exit code: $code)"
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
