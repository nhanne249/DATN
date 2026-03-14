# Build stage
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web server --docker

# Installer stage
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# First copy only the json files to install dependencies
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm ci --legacy-peer-deps

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npm run build

# Runner stage
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g pm2

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir -p /app/apps/server/public/uploads && chown -R nextjs:nodejs /app
USER nextjs

# Copy workspace root deps (hoisted)
COPY --from=installer /app/node_modules ./node_modules

# Copy web app files needed for next start
COPY --from=installer /app/apps/web/package.json ./apps/web/package.json
COPY --from=installer /app/apps/web/next.config.ts ./apps/web/next.config.ts

# Next.js build output for runtime
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public

# Copy server assets
COPY --from=installer /app/apps/server/dist ./apps/server/dist
COPY --from=installer /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=installer /app/apps/server/package.json ./apps/server/package.json

# Expose ports for both apps
EXPOSE 3000 3001

# Orchestration script
COPY --chown=nextjs:nodejs <<EOF start.sh
#!/bin/sh
# Start server on 3000
PORT=3000 pm2 start "node apps/server/dist/main" --name server
# Start web on 3001
PORT=3001 pm2-runtime start --name web "cd /app/apps/web && node /app/node_modules/next/dist/bin/next start -p 3001"
EOF

RUN chmod +x start.sh

CMD ["./start.sh"]
