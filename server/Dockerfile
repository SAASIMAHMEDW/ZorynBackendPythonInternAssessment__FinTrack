FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build
RUN npm run build

# ─── Production stage ────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/package.json ./

EXPOSE 5000

CMD ["node", "dist/server.js"]
