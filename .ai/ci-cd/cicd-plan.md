# CI/CD Plan

This document provides a detailed overview of the Continuous Integration (CI) and Continuous Deployment (CD) pipelines for the AI Flashcard Generator project.

## 1. Goals

- **Ensure Code Quality**: Automatically enforce coding standards and run tests to catch bugs early.
- **Automate Testing**: Run a comprehensive suite of tests (linting, unit, E2E) on every change.
- **Streamline Deployment**: Automate the process of building, publishing, and deploying the application to production.
- **Improve Stability**: Reduce the risk of manual errors during deployment.

## 2. Tech Stack

- **Orchestration**: GitHub Actions
- **Containerization**: Docker
- **Container Registry**: GitHub Container Registry (ghcr.io)
- **Secure Networking**: Tailscale (for connecting to the deployment server)
- **Testing**:
  - **Linting**: ESLint and Prettier
  - **Unit Testing**: Vitest
  - **End-to-End Testing**: Playwright

## 3. Continuous Integration (CI)

The CI pipeline is defined in `.github/workflows/ci-master.yml`.

- **Trigger**: Runs on every `pull_request` to the `master` branch.

### Jobs

#### 1. `lint`

- **Purpose**: Enforces code style and formatting consistency across the codebase.
- **Steps**:
  1. Checks out the code.
  2. Sets up Node.js using the version specified in `.nvmrc`.
  3. Installs dependencies with `npm ci`.
  4. Runs `npm run format` to check for Prettier formatting issues.

#### 2. `test`

- **Purpose**: Runs unit tests to verify the correctness of individual components and functions.
- **Depends On**: `lint`
- **Steps**:
  1. Checks out the code.
  2. Sets up Node.js.
  3. Installs dependencies with `npm ci`.
  4. Runs `npm run test` to execute the Vitest test suite.

#### 3. `e2e-test`

- **Purpose**: Runs end-to-end tests to validate full application flows in a real browser environment.
- **Depends On**: `lint`
- **Steps**:
  1. Checks out the code.
  2. Sets up Node.js.
  3. Installs dependencies with `npm ci`.
  4. Installs Playwright browsers with `npx playwright install --with-deps`.
  5. Runs `npm run test:e2e` to execute the Playwright test suite.
  6. Uploads the Playwright report as a build artifact.
- **Secrets**: This job requires `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_KEY` to interact with the backend during tests.

## 4. Continuous Deployment (CD)

The CD pipeline is defined in `.github/workflows/deploy.yml`.

- **Trigger**: Manual execution via `workflow_dispatch`. This is a deliberate choice to prevent accidental deployments.

### Secrets Required

The following secrets must be configured in the GitHub repository settings:

- `GH_REGISTRY_TOKEN`: A GitHub Personal Access Token with `write:packages` scope to push to ghcr.io.
- `PUBLIC_SUPABASE_URL`: Supabase project URL.
- `PUBLIC_SUPABASE_KEY`: Supabase project anon key.
- `OPENAI_API_KEY`: API key for the AI service.
- `TS_OAUTH_CLIENT_ID`: Tailscale OAuth client ID.
- `TS_OAUTH_SECRET`: Tailscale OAuth secret.
- `SSH_USERNAME`: Username for the deployment server.
- `TS_SERVER_IP`: Tailscale IP address of the deployment server.

### Steps

1.  **Checkout Code**: The repository code is checked out.
2.  **Set up Docker Buildx**: Initializes the Docker builder.
3.  **Log in to GHCR**: Authenticates with the GitHub Container Registry using the `GH_REGISTRY_TOKEN`.
4.  **Extract Metadata**: Generates tags for the Docker image (e.g., `latest`, and a tag based on the commit SHA).
5.  **Build and Push Docker Image**:
    - Builds the multi-stage `Dockerfile`.
    - Passes `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_KEY` as build arguments to be available during the `astro build` process.
    - Pushes the final image to `ghcr.io/artexs/astro-app` with the generated tags.
    - Uses GitHub Actions cache for faster builds.
6.  **Connect to Tailscale**: Authenticates with Tailscale to get access to the private network where the deployment server resides.
7.  **Deploy to Server**:
    - Opens an SSH connection to the deployment server using its Tailscale IP.
    - Executes a script on the remote server to:
      1.  Log in to `ghcr.io` using the provided token.
      2.  Pull the `latest` image.
      3.  Stop and remove the existing container (`astro-app-container`).
      4.  Run a new container with the updated image, passing all necessary environment variables (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_KEY`, `OPENAI_API_KEY`).
      5.  Clean up old, unused Docker images to save disk space.

## 5. Local Development and Testing

The Docker setup can be replicated locally for testing and development, simulating the production environment.

- **Script**: The `run-docker-container.sh` script automates this process.
- **Usage**:
  ```bash
  npm run docker:run
  ```
- **Environment**: The script requires a `.env` file in the project root containing the same environment variables as the production container.

## 6. Future Improvements

- **Automated Deployments**: The CD pipeline could be changed to trigger automatically on merges to the `master` branch to achieve true Continuous Deployment.
- **Staging Environment**: Introduce a staging environment to test new versions of the application before deploying to production.
- **Notifications**: Add notifications (e.g., via Slack or Discord) to report the status of CI/CD runs.
- **Security Scanning**: Integrate a tool like Trivy or Snyk to scan the Docker image for vulnerabilities before deployment.
