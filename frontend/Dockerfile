# Frontend image: Next.js production build served by `next start`
FROM node:22-alpine

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

EXPOSE 3000

# Serve the production build, listening on all interfaces.
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
