#!/bin/bash

# Script to update openapi.json from the backend API
# Usage: ./scripts/update-openapi.sh [BASE_URL]
# If BASE_URL is not provided, it will use the API_BASE_URL from .env file

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Get BASE_URL from argument or .env file
if [ -n "$1" ]; then
    BASE_URL="$1"
else
    # Try to read from .env file
    if [ -f "$PROJECT_ROOT/.env" ]; then
        BASE_URL=$(grep -E '^API_BASE_URL=' "$PROJECT_ROOT/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    fi
fi

if [ -z "$BASE_URL" ]; then
    echo "Error: BASE_URL not provided and API_BASE_URL not found in .env file"
    echo "Usage: $0 [BASE_URL]"
    echo "Example: $0 https://api.example.com"
    exit 1
fi

# Remove trailing slash if present
BASE_URL="${BASE_URL%/}"

OPENAPI_URL="$BASE_URL/api/openapi.json"
OUTPUT_FILE="$PROJECT_ROOT/openapi.json"

echo "Fetching OpenAPI spec from: $OPENAPI_URL"

# Download the OpenAPI spec
if command -v curl &> /dev/null; then
    curl -s "$OPENAPI_URL" -o "$OUTPUT_FILE"
elif command -v wget &> /dev/null; then
    wget -q "$OPENAPI_URL" -O "$OUTPUT_FILE"
else
    echo "Error: Neither curl nor wget is installed"
    exit 1
fi

# Validate JSON
if command -v node &> /dev/null; then
    if ! node -e "JSON.parse(require('fs').readFileSync('$OUTPUT_FILE'))" 2>/dev/null; then
        echo "Error: Downloaded file is not valid JSON"
        exit 1
    fi
else
    echo "Warning: Node.js not available, skipping JSON validation"
fi

echo "OpenAPI spec saved to: $OUTPUT_FILE"

# Optionally regenerate API client if swagger-typescript-api is installed
if [ -f "$PROJECT_ROOT/package.json" ]; then
    if grep -q "generate:api" "$PROJECT_ROOT/package.json" 2>/dev/null; then
        echo "Regenerating API client..."
        cd "$PROJECT_ROOT"
        pnpm generate:api
        echo "API client regenerated successfully"
    fi
fi

echo "Done!"
