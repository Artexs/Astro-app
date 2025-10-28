#!/bin/bash

# Determine which environment file to use
ENV_FILE=${1:-".env"} # Default to .env if no argument is provided

if [ -f "$ENV_FILE" ]; then
  echo "Loading environment variables from $ENV_FILE"
  export $(grep -v '^#' $ENV_FILE | xargs)
else
  echo "Error: Environment file '$ENV_FILE' not found."
  exit 1
fi
fi

# Check if required environment variables are set
if [ -z "$PUBLIC_SUPABASE_URL" ] || \
   [ -z "$PUBLIC_SUPABASE_KEY" ] || \
   [ -z "$OPENAI_API_KEY" ]; then
  echo "Error: One or more required environment variables are not set."
  echo "Please ensure PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, and OPENAI_API_KEY are set."
  exit 1
fi

# Check if a container with the same name already exists and remove it
CONTAINER_NAME="astro-app-container"
IMAGE_NAME="astro-app:latest"

# Check if a container with the same name already exists and remove it
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping and removing existing container $CONTAINER_NAME..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

echo "Building Docker image '$IMAGE_NAME'..."
docker build \
  --build-arg PUBLIC_SUPABASE_URL="$PUBLIC_SUPABASE_URL" \
  --build-arg PUBLIC_SUPABASE_KEY="$PUBLIC_SUPABASE_KEY" \
  -t $IMAGE_NAME . || { echo "Docker build failed!"; exit 1; }

echo "Running Docker container '$IMAGE_NAME'"
docker run --name $CONTAINER_NAME -p 3000:3000 --network host \
  -e PUBLIC_SUPABASE_URL="$PUBLIC_SUPABASE_URL" \
  -e PUBLIC_SUPABASE_KEY="$PUBLIC_SUPABASE_KEY" \
  -e OPENAI_API_KEY="$OPENAI_API_KEY" \
  $IMAGE_NAME

if [ $? -eq 0 ]; then
  echo "Docker container started successfully."
else
  echo "Error starting Docker container."
  exit 1
fi
