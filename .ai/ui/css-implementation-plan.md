# CSS Implementation Plan

## Overview

This document provides a detailed, step-by-step guide for refactoring the project's entire CSS structure. The plan is to build a new, modern styling system using Tailwind CSS, based on the decisions from our conversation.

---

## Phase 1: Foundational Setup

This phase covers the core configuration and global styles that will underpin the entire project.

### Step 1.1: Define Design Tokens in `global.css`

1.  **Clear Existing Content:** Open `src/styles/global.css` and remove its current content.
2.  **Add CSS Variables:** Define a new set of CSS custom properties for the design system. This includes separate palettes for light (`:root`) and dark (`.dark`) modes.

    ```css
    @layer base {
      :root {
        --background: 240 10% 3.9%; /* Example HSL */
        --foreground: 0 0% 98%;
        --card: 240 10% 3.9%;
        --card-foreground: 0 0% 98%;
        --popover: 240 10% 3.9%;
        --popover-foreground: 0 0% 98%;
        --primary: 262.1 83.3% 57.8%;
        --primary-foreground: 0 0% 98%;
        --primary-muted: 262.1 83.3% 57.8% / 0.1; /* For gradient */
        --destructive: 0 62.8% 30.6%;
        --border: 240 3.7% 15.9%;
        --input: 240 3.7% 15.9%;
        --ring: 262.1 83.3% 57.8%;
        --radius: 0.5rem;
      }

      .dark {
        /* Define dark mode variable overrides here */
      }
    }
    ```

### Step 1.2: Implement the Global Background Style

1.  In `src/styles/global.css`, within the `@layer base` rule, style the `body` element.
2.  Apply the subtle radial gradient discussed.

    ```css
    @layer base {
      /* ... variables ... */
      body {
        @apply bg-background text-foreground;
        background: radial-gradient(circle, hsl(var(--primary-muted)) 0%, hsl(var(--background)) 70%);
      }
    }
    ```

### Step 1.3: Configure Tailwind CSS

1.  **Edit `tailwind.config.mjs`:** Open the Tailwind configuration file.
2.  **Extend Theme:** Modify the `theme.extend` object to make Tailwind aware of the new CSS variables. This allows using classes like `bg-primary`.

    ```javascript
    // tailwind.config.mjs
    theme: {
      extend: {
        colors: {
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          // ... other colors
        },
        borderRadius: {
          lg: `var(--radius)`,
          md: `calc(var(--radius) - 2px)`,
          sm: `calc(var(--radius) - 4px)`,
        },
      },
    },
    ```

### Step 1.4: Install & Configure Helper Plugins

1.  **Open Terminal:** Run the following commands to install the necessary development dependencies.
    ```bash
    npm install -D prettier-plugin-tailwindcss @tailwindcss/line-clamp
    ```
2.  **Configure Prettier:** In `.prettierrc.json` (or your Prettier config file), add the plugin:
    ```json
    {
      "plugins": ["prettier-plugin-tailwindcss"]
    }
    ```
3.  **Configure Tailwind:** In `tailwind.config.mjs`, add the line-clamp plugin:
    ```javascript
    // tailwind.config.mjs
    plugins: [require('@tailwindcss/line-clamp')],
    ```

---

## Phase 2: Component Styling & Refactoring

This phase focuses on applying the new design system to the application's components.

### Step 2.1: Refactor Core UI Components

1.  Go through each core `shadcn` component in `src/components/ui/` (e.g., `button.tsx`, `input.tsx`, `card.tsx`).
2.  Update the `cva` variants to use the new semantic color names defined in the Tailwind config (e.g., `bg-primary`, `border-destructive`).

### Step 2.2: Style Forms and Their Containers

1.  For all form pages (`/login`, `/register`, `/account`, etc.), ensure the main form element is wrapped within the `Card` component (`<Card className="w-full max-w-md">...</Card>`).
2.  This will give the forms the desired "box" appearance, visually separating them from the new global gradient background.

### Step 2.3: Implement Flashcard Styles

1.  **Base Style:** Use the `Card` component as the base for `ManagedCard.tsx` and `ReviewableCard.tsx`.
2.  **Grid Layout:** In the parent views (`MyCardsView.tsx`, `ReviewView.tsx`), apply the responsive grid classes to the container: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6`.
3.  **Text Overflow:** In `ManagedCard.tsx`, apply the `line-clamp` utility to the answer text to prevent long text from breaking the grid layout: `className="line-clamp-3"`.

---

## Phase 3: Advanced Interactivity & Animation

This phase implements the more complex, dynamic styling requirements.

### Step 3.1: Create the 3D Card Flip Animation

1.  **Target `StudyCard.tsx`:** This styling is specific to the study view.
2.  **Add CSS to `global.css`:** Add the necessary structural CSS for the 3D effect.
    ```css
    /* Add to global.css */
    .card-3d-container {
      transform-style: preserve-3d;
      perspective: 1000px;
    }
    .card-3d-face {
      backface-visibility: hidden;
    }
    .card-3d-back {
      transform: rotateY(180deg);
    }
    ```
3.  **Apply Classes in Component:** In `StudyCard.tsx`, structure your component with a container and two "face" divs. Use a state (`isFlipped`) to conditionally apply a class that triggers the rotation on the container.
    - Container `className`: `card-3d-container transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`
    - Front face `className`: `card-3d-face`
    - Back face `className`: `card-3d-face card-3d-back`

### Step 3.2: Implement Word Count Validator Logic

1.  **Target `WordCountValidator.tsx`:** This component will need to receive props for the word count and whether a submission has been attempted.
2.  **Apply Conditional Classes:** Use a function to determine the correct text color class.
    ```javascript
    const getTextColor = (count, attemptedSubmit) => {
      const isValid = count >= 1000 && count <= 10000;
      if (isValid) return "text-green-500";
      if (attemptedSubmit && !isValid) return "text-destructive";
      return "text-neutral-500"; // Default neutral color
    };
    // <p className={getTextColor(wordCount, hasAttemptedSubmit)}>...</p>
    ```

### Step 3.3: Create the `EmptyState` Component

1.  **Create `src/components/ui/EmptyState.tsx`:** Build a new reusable component.
2.  **Structure and Style:** Use Flexbox to center the content. Include a `lucide-react` icon, a heading, a paragraph, and a `Button` component for the call-to-action.
    ```jsx
    // Example structure
    <div className="flex flex-col items-center justify-center gap-4 text-center">
      <Icon size={48} />
      <h3 className="font-bold text-lg">No Cards Found</h3>
      <p className="text-muted-foreground">Get started by creating your first set of flashcards.</p>
      <Button onClick={() => (window.location.href = "/create")}>Create Cards</Button>
    </div>
    ```
