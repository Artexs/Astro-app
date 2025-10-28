# Stage 1: Build the application
FROM node:22-slim AS builder

WORKDIR /app

# Declare build arguments for Supabase environment variables
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_KEY

# Set environment variables from build arguments for the build stage
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_KEY=$PUBLIC_SUPABASE_KEY

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy source files
COPY . .

# Build the Astro SSR application
RUN npm run build

# Stage 2: Run the application
FROM node:22-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment to production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Run the built server directly
CMD ["node", "./dist/server/entry.mjs"]
