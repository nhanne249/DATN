FROM node:20-slim

WORKDIR /app

# Copy root configs
COPY package*.json ./
COPY turbo.json ./

# Copy apps package.json to leverage docker caching
COPY apps/server/package*.json ./apps/server/
COPY apps/client/package*.json ./apps/client/

# Install dependencies at the root workspace
RUN npm ci --legacy-peer-deps

# Copy all source code
COPY . .

# Build both applications using turbo
RUN npm run build

# Install pm2 for process management
RUN npm install -g pm2

# Create startup script to run both backend and frontend proxy
RUN printf '#!/bin/sh\n\
set -e\n\
echo "Starting backend on port 3000..."\n\
cd /app/apps/server\n\
pm2 start npm --name backend --no-autorestart -- run start:prod\n\
sleep 3\n\
echo "Backend started"\n\
\n\
echo "Starting frontend preview server on port 5173..."\n\
cd /app/apps/client\n\
pm2 start npm --name frontend --no-autorestart -- run start\n\
sleep 2\n\
echo "Frontend started"\n\
\n\
echo "Showing PM2 status..."\n\
pm2 list\n\
\n\
echo "Following logs..."\n\
pm2 logs --no-daemon\n' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 5173

CMD ["/bin/sh", "/app/start.sh"]
