# ── Stage 1: build the web export ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (layer-cached unless package files change)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source and build the static web bundle → /app/dist
COPY . .
RUN npx expo export --platform web

# ── Stage 2: serve with nginx ──────────────────────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
