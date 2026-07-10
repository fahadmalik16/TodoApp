
# ---- Stage 1: build ----
FROM node:22-alpine AS builder

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies first (cached unless package files change).
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build. NEXT_PUBLIC_* vars are inlined at build time,
# so the backend URL must be provided as a build arg here.
COPY . .
ARG NEXT_PUBLIC_API_URL=http://localhost:8090
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# ---- Stage 2: runtime ----
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV HOSTNAME=0.0.0.0 PORT=3000
CMD ["node", "server.js"]
