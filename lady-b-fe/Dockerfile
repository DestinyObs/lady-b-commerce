FROM node:20-alpine AS base
WORKDIR /app

# ─── Development stage ───────────────────────────────────────────────────────
FROM base AS development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ─── Builder stage ────────────────────────────────────────────────────────────
FROM base AS builder
ARG VITE_API_URL
ARG VITE_STRIPE_PUBLIC_KEY
ARG VITE_PAYPAL_CLIENT_ID
ARG VITE_CLOUDINARY_CLOUD_NAME
ARG VITE_CLOUDINARY_UPLOAD_PRESET
ENV VITE_API_URL=$VITE_API_URL \
    VITE_STRIPE_PUBLIC_KEY=$VITE_STRIPE_PUBLIC_KEY \
    VITE_PAYPAL_CLIENT_ID=$VITE_PAYPAL_CLIENT_ID \
    VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME \
    VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ─── Production stage (served via nginx) ─────────────────────────────────────
FROM nginx:1.25-alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
