# Build stage
FROM node:20-alpine AS builder

# Install pnpm and curl (needed for openapi update)
RUN corepack enable && corepack prepare pnpm@10.17.0 --activate && \
    apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all files
COPY . .

# Build argument for API base URL
ARG API_BASE_URL

# Update openapi.json if API_BASE_URL is provided
RUN if [ -n "$API_BASE_URL" ]; then \
        echo "Updating openapi.json from $API_BASE_URL..." && \
        node scripts/update-openapi.js "$API_BASE_URL"; \
    fi

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy built application from builder
COPY --from=builder /app/.output ./.output

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
