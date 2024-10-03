# Stage 1: Build the application
# FROM node:22 AS builder
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Serve the application
# FROM node:22
# WORKDIR /usr/src/app
# COPY --from=builder . .
# # COPY --from=builder /usr/src/app/public ./public
# COPY package*.json ./
# RUN npm install --only=production
# CMD ["npm", "start"]


# Stage 1: Build the app
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the app
FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
RUN npm install --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./
CMD ["npm", "start"]