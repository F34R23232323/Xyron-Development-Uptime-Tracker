FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# IMPORTANT: Uptime Kuma needs legacy peer deps
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Persistent data
VOLUME ["/app/data"]

ENV NODE_ENV=production
ENV PORT=3005

EXPOSE 3005

CMD ["node", "server/server.js"]
