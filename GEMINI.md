# Project: 10x Astro Starter

## Project Overview

This is a modern, opinionated starter template for building fast, accessible, and AI-friendly web applications. The project is built with Astro, a modern web framework for building fast, content-focused websites. It uses React for building interactive components, TypeScript for type-safe JavaScript, and Tailwind CSS for styling.

The project is configured with AI development tools to enhance the development experience, providing guidelines for project structure, coding practices, and more.

## Building and Running

### Prerequisites

*   Node.js v22.14.0 (as specified in `.nvmrc`)
*   npm (comes with Node.js)

### Getting Started

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Build for production:**
    ```bash
    npm run build
    ```

### Available Scripts

*   `npm run dev`: Start development server
*   `npm run build`: Build for production
*   `npm run preview`: Preview production build
*   `npm run lint`: Run ESLint
*   `npm run lint:fix`: Fix ESLint issues
*   `npm run format`: Format code with Prettier

## Development Conventions

*   **Coding Style:** The project uses ESLint and Prettier to enforce a consistent coding style. Configuration files for these tools can be found in `eslint.config.js` and `.prettierrc.json`.
*   **Testing:** There are no explicit testing practices defined in the project.
*   **Contribution Guidelines:** The project has AI guidelines and coding practices defined in the AI configuration files. See the `AI Development Support` section in the `README.md` for more details.
*   **Project Structure:**
    ```
    .
    ├── src/
    │   ├── layouts/    # Astro layouts
    │   ├── pages/      # Astro pages
    │   │   └── api/    # API endpoints
    │   ├── components/ # UI components (Astro & React)
    │   └── assets/     # Static assets
    ├── public/         # Public assets
    ```
