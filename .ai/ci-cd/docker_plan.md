# Dockerization Plan for Astro Node.js Application

## 1. Goal
To containerize the Astro Node.js application into a Docker image, enabling consistent deployment and local execution with necessary environment variables.

## 2. Base Image Selection
Given the request for a "light Ubuntu version", we will use a slim Node.js image based on Debian (which Ubuntu is based on). This provides a good balance between size and compatibility.
Recommended: `node:22-slim` or `node:22-alpine` (if even smaller size is critical and Alpine compatibility is confirmed). For this plan, we will proceed with `node:22-slim`.

## 3. Dockerfile Strategy

A multi-stage build will be used to optimize the Docker image size.
*   **Build Stage**: Install dependencies and build the Astro application.
*   **Production Stage**: Copy only the necessary build artifacts and production dependencies to a smaller runtime image.

### Dockerfile (`./Dockerfile`)

```dockerfile
# Stage 1: Build the application
FROM node:22-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install production dependencies first to leverage Docker cache
RUN npm ci --only=production

# Copy all application files
COPY . .

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Build the Astro application
RUN npm run build

# Stage 2: Run the application
FROM node:22-slim

WORKDIR /app

# Copy only production dependencies from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expose the port the Astro application runs on (default is 3000)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "preview"]
```

## 4. Build and Run Commands

### 4.1. Build the Docker Image

To build the Docker image, navigate to the project root directory and execute:

```bash
docker build -t astro-app:latest .
```
*   `-t astro-app:latest`: Tags the image with the name `astro-app` and the tag `latest`.

### 4.2. Run the Docker Container Locally

To run the Docker container, exposing the application on a local port and passing necessary environment variables:

```bash
docker run -p 3000:3000 \
  -e PUBLIC_SUPABASE_URL="your_supabase_url" \
  -e PUBLIC_SUPABASE_KEY="your_supabase_key" \
  -e OPENAI_API_KEY="your_openai_api_key" \
  astro-app:latest
```
*   `-p 3000:3000`: Maps port 3000 of the host to port 3000 of the container.
*   `-e VAR_NAME="value"`: Sets environment variables inside the container. **Remember to replace placeholder values with your actual keys.**
*   `astro-app:latest`: Specifies the image to run.

### 4.3. Environment Variables

The following environment variables are identified as potentially necessary based on common Node.js/Astro project setups and the project's `.env.example` and `.env.test` files:

*   `PUBLIC_SUPABASE_URL`: URL for Supabase client.
*   `PUBLIC_SUPABASE_KEY`: Public API key for Supabase client.
*   `OPENAI_API_KEY`: API key for OpenAI services.

These should be provided during the `docker run` command or managed via a `.env` file if using Docker Compose. For this plan, we focus on direct `docker run` commands.

## 5. Integration with `package.json` Scripts

To streamline the Docker build and run processes, you can add scripts to your `package.json` file. This allows you to execute Docker commands using `npm run <script-name>`.

Add the following to the `"scripts"` section of your `package.json`:

```json
  "docker:build": "docker build -t astro-app:latest .",
  "docker:run": "docker run -p 3000:3000 -e PUBLIC_SUPABASE_URL=\"your_supabase_url\" -e PUBLIC_SUPABASE_KEY=\"your_supabase_key\" -e OPENAI_API_KEY=\"your_openai_api_key\" astro-app:latest"
```

**Usage:**
*   `npm run docker:build`
*   `npm run docker:run` (Remember to replace environment variable placeholders before running).

## 6. Shell Scripts for Convenience

For more complex scenarios or to manage environment variables outside of `package.json`, dedicated shell scripts can be used.

### `build-docker-image.sh`

Create a file named `build-docker-image.sh` in your project root with the following content:

```bash
#!/bin/bash

echo "Building Docker image 'astro-app:latest'"
docker build -t astro-app:latest .

if [ $? -eq 0 ]; then
  echo "Docker image built successfully."
else
  echo "Error building Docker image."
  exit 1
fi
```

Make it executable:
`chmod +x build-docker-image.sh`

### `run-docker-container.sh`

Create a file named `run-docker-container.sh` in your project root with the following content. This script demonstrates how to load environment variables from a `.env` file (e.g., `.env.docker`) for local development.

```bash
#!/bin/bash

# Load environment variables from a .env file (e.g., .env.docker)
# Create a .env.docker file in the project root with your actual environment variables:
# PUBLIC_SUPABASE_URL="your_supabase_url"
# PUBLIC_SUPABASE_KEY="your_supabase_key"
# OPENAI_API_KEY="your_openai_api_key"

ENV_FILE=".env.docker"

if [ -f "$ENV_FILE" ]; then
  echo "Loading environment variables from $ENV_FILE"
  export $(grep -v '^#' $ENV_FILE | xargs)
else
  echo "Warning: $ENV_FILE not found. Running with potentially unset environment variables."
fi

# Check if required environment variables are set
if [ -z "$PUBLIC_SUPABASE_URL" ] || \
   [ -z "$PUBLIC_SUPABASE_KEY" ] || \
   [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: One or more required environment variables are not set."
  echo "Please ensure PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, and OPENAI_API_KEY are set."
  exit 1
fi

echo "Running Docker container 'astro-app:latest'"
docker run -p 3000:3000 \
  -e PUBLIC_SUPABASE_URL="$PUBLIC_SUPABASE_URL" \
  -e PUBLIC_SUPABASE_KEY="$PUBLIC_SUPABASE_KEY" \
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \
  astro-app:latest

if [ $? -eq 0 ]; then
  echo "Docker container started successfully."
else
  echo "Error starting Docker container."
  exit 1
fi
```

Make it executable:
`chmod +x run-docker-container.sh`

## 7. Next Steps
*   Create the `Dockerfile` in the project root.
*   Update `package.json` with the new scripts.
*   (Optional) Create `build-docker-image.sh` and `run-docker-container.sh`.
*   Create a `.env.docker` file with your actual environment variables if using `run-docker-container.sh`.
*   Execute the build and run commands/scripts.
