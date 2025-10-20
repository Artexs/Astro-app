# AI Flashcard Generator

An AI-powered web application that automatically generates flashcards from user-provided text, designed to streamline the study process for students and lifelong learners.

## Table of Contents

- [The Problem](#the-problem)
- [The Solution](#the-solution)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [AI Development Support](#ai-development-support)
- [Project Scope](#project-scope)
- [Contributing](#contributing)
- [Project Status](#project-status)
- [License](#license)

## The Problem

Students and lifelong learners often have large volumes of text (e.g., lecture notes, articles, textbook chapters) that they need to convert into effective study materials. The process of manually creating flashcards is time-consuming, tedious, and can be a significant barrier to efficient learning.

## The Solution

This application automates the creation of high-quality, relevant flashcards. Users can paste large blocks of text and receive AI-generated flashcards in a question-and-answer format. This allows users to spend more time studying and less time on preparation.

The core workflow is simple:

1.  **Paste Your Text**: Input your notes, articles, or any text into the application.
2.  **Generate Cards**: The AI analyzes the text and generates a set of flashcards.
3.  **Review & Save**: Quickly accept or reject the generated cards to build your personal collection.
4.  **Study**: Use the minimalist study mode to review your flashcards and reinforce your learning.

## Features

- **Secure User Authentication**: Sign-up, login, and password management handled by Supabase Auth.
- **AI-Powered Generation**: Paste text (1,000-10,000 words) and receive high-quality, AI-generated flashcards.
- **Review Workflow**: A dedicated interface to review, accept, or reject generated cards before adding them to your collection.
- **Personal Card Collection**: View, manage, and delete all your accepted flashcards in a personal dashboard.
- **Minimalist Study Mode**: A distraction-free environment to study your flashcards one by one, with a simple flip-and-reveal mechanism.
- **Account Management**: Users can change their password or permanently delete their account and all associated data.

## Tech Stack

### Frontend

- **[Astro](https://astro.build/)**: The primary web framework, used for its high-performance, content-focused architecture.
- **[React](https://react.dev/)**: Used for building interactive UI components ("islands of interactivity").
- **[TypeScript](https://www.typescriptlang.org/)**: Provides static typing for all JavaScript code.
- **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.

### Backend & Database

- **[Supabase](https://supabase.com/)**: An all-in-one backend-as-a-service platform.
  - **Supabase Auth**: Manages user authentication (sign-up, login, password reset).
  - **Supabase Database**: A managed PostgreSQL database for storing user and flashcard data.
- **[Astro API Routes](https://docs.astro.build/en/guides/api/)**: Serverless endpoints for secure communication with the external AI service.

### AI

- **External AI Service (TBD)**: An external API (e.g., OpenAI's GPT series, Google's Gemini) is used to generate questions and answers from text.

### Development & Tooling

- **[Node.js](https://nodejs.org/)**: The runtime environment.
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)**: For code linting and formatting to ensure code quality.

## Getting Started Locally

### Prerequisites

- **Node.js**: Version `22.14.0` (as specified in the `.nvmrc` file).
- **Supabase Account**: You will need a Supabase project to handle authentication and database storage.

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Set up environment variables:**
    Create a `.env` file by copying the example file.

    ```bash
    cp .env.example .env
    ```

    Open the `.env` file and add your Supabase Project URL and Anon Key. You will also need to add the API key for the AI service you intend to use.

    ```env
    PUBLIC_SUPABASE_URL="your-supabase-url"
    PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
    AI_SERVICE_API_KEY="your-ai-service-api-key"
    ```

3.  **Install dependencies:**

    ```bash
    npm install
    ```

4.  **Set up local Supabase environment:**
    This command starts the local Supabase services (database, auth, etc.).

    ```bash
    npx supabase start
    ```

    You can access the local Supabase Studio at `http://localhost:54323`.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000/`.

## Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run preview`: Preview the production build locally.
- `npm run lint`: Run ESLint to check for code quality issues.
- `npm run lint:fix`: Automatically fix ESLint issues.

## Project Structure

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

## AI Development Support

This project is configured with AI development tools to enhance the development experience, providing guidelines for project structure, coding practices, and more.

- **Cursor**: See the `.cursor/` directory for AI rules that help the IDE understand the project.
- **GitHub Copilot**: See `.github/copilot-instructions.md` for instructions.
- **Windsurf**: See `.windsurfrules` for its configuration.

## Project Scope

### In Scope (MVP)

- Email/Password authentication via Supabase.
- Synchronous flashcard generation from text (1,000-10,000 words).
- Text-only flashcards (Front/Back).
- A single collection of flashcards per user.
- Full review flow (Accept/Reject).
- Card management (View/Delete).
- Random-order study module.

### Out of Scope (Future Considerations)

- Asynchronous/background flashcard generation.
- Support for file uploads (e.g., PDF, DOCX) or URL inputs.
- Flashcards with images, formatting, or other media.
- Multiple decks or collections of flashcards per user.
- Editing flashcards after they are accepted.
- Sharing flashcards or decks with other users.
- Implementation of an FSRS algorithm for spaced repetition.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## Project Status

This project is currently in **active development**. The immediate goal is to deliver the Minimum Viable Product (MVP) as defined in the project scope.

## License

This project is not currently licensed.
