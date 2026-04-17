# syntax=docker/dockerfile:1

FROM node:22-bookworm AS base

# Install dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN npm install --omit=dev

# Build stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production stage
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs strapi

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env.prod ./.env
COPY ecosystem.config.js ./

RUN chown -R strapi:nodejs /app

USER strapi

EXPOSE 1337

CMD ["node", "node_modules/.bin/pm2-runtime", "ecosystem.config.js"]
