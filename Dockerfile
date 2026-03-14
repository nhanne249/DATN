# Build stage
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune web server clientpage --docker

# Installer stage
FROM node:20-alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

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

# Copy clientpage files needed for next start
COPY --from=installer /app/apps/clientpage/package.json ./apps/clientpage/package.json
COPY --from=installer /app/apps/clientpage/next.config.ts ./apps/clientpage/next.config.ts
COPY --from=installer --chown=nextjs:nodejs /app/apps/clientpage/.next ./apps/clientpage/.next
COPY --from=installer --chown=nextjs:nodejs /app/apps/clientpage/public ./apps/clientpage/public

# Copy server assets
COPY --from=installer /app/apps/server/dist ./apps/server/dist
COPY --from=installer /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=installer /app/apps/server/package.json ./apps/server/package.json

# Expose ports for server + web + clientpage
EXPOSE 3000 3001 3002

# PM2 ecosystem
COPY --chown=nextjs:nodejs <<EOF ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: 'server',
      script: 'apps/server/dist/main.js',
      interpreter: 'node',
      env: { PORT: '3000' },
    },
    {
      name: 'web',
      cwd: '/app/apps/web',
      script: '/app/node_modules/next/dist/bin/next',
      interpreter: 'node',
      args: 'start -p 3001',
      env: { PORT: '3001' },
    },
    {
      name: 'clientpage',
      cwd: '/app/apps/clientpage',
      script: '/app/node_modules/next/dist/bin/next',
      interpreter: 'node',
      args: 'start -p 3002',
      env: { PORT: '3002' },
    },
  ],
};
EOF

CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
