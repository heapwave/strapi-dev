# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9 --activate

# Install dependencies stage
FROM base AS deps

RUN apk add --no-cache libc6-compat python3 make gcc g++
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

# Build stage
FROM base AS builder

RUN apk add --no-cache libc6-compat python3 make gcc g++
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm build

# Production stage
FROM base AS runner

RUN apk add --no-cache libc6-compat python3 make gcc g++
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 strapi

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env.prod ./.env
COPY ecosystem.config.js ./

RUN pnpm --offline install --frozen-lockfile

RUN chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

CMD ["node", "node_modules/.bin/pm2-runtime", "runtime", "ecosystem.config.js"]
