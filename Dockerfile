FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@10.17.0 --activate && \
    apk add --no-cache curl

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

ARG API_BASE_URL

RUN if [ -n "$API_BASE_URL" ]; then \
        echo "Updating openapi.json from $API_BASE_URL..." && \
        node scripts/update-openapi.js "$API_BASE_URL"; \
    fi

RUN pnpm build

FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
