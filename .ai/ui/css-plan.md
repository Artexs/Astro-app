# CSS Refactoring Plan

## 1. Overview & Goals

This document outlines the complete refactoring plan for the project's CSS. The primary goal is to rebuild the styling from scratch, establishing a modern, maintainable, and performant system.

The core strategy is to use a utility-first approach with Tailwind CSS, underpinned by a consistent design token philosophy inspired by Fluent UI 2. This will replace the previous inconsistent styles and provide a solid foundation for all current and future UI development, focusing on a clean aesthetic, responsiveness, and an improved developer experience.

## 2. Foundational Strategy

### Design Tokens (Colors & Radius)

- A new, consistent color palette and radius scale will be defined as CSS custom properties (variables) in `src/styles/global.css`.
- Variables will be defined in `:root` for light mode and overridden in a `.dark` class for dark mode.
- This system will be the single source of truth for all colors (background, foreground, primary, destructive), borders, and shadows.

### Base Styles & Background

- The `body` background will be a subtle, two-tone radial gradient to add depth without distracting from the content. It will be unified across the entire application.
  ```css
  body {
    background: radial-gradient(circle, var(--primary-muted) 0%, var(--background) 70%);
  }
  ```
- Base styles in `@layer base` will set the default font family and ensure the base text color is `var(--foreground)`.

### Typography & Icons

- **Fonts:** A modern variable font (e.g., "Satoshi" or "Inter") will be self-hosted to ensure performance and visual consistency.
- **Icons:** The `lucide-react` library will be used for all icons. It is tree-shakable, ensuring that only the icons used in the project are included in the final bundle.

### Tailwind CSS Integration

- The `tailwind.config.mjs` file will be extended to recognize the new CSS design tokens (e.g., `colors: { primary: 'var(--primary)' }`).
- The official `prettier-plugin-tailwindcss` will be installed to automatically sort utility classes, ensuring code consistency and readability.

## 3. Layout System

### Main Page Structure

- The primary application layout (`src/layouts/Layout.astro`) will use CSS Flexbox to create a "sticky footer" design (`flex flex-col min-h-screen`). The main content area will grow to fill available space (`flex-grow`).

### Responsive Grids

- Responsive layouts, particularly the 3-column flashcard grid, will be implemented using CSS Grid (`display: grid`).
- Tailwind’s standard, mobile-first breakpoints (`sm`, `md`, `lg`, `xl`) will be used to adapt the grid for different screen sizes (e.g., `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).

## 4. Component-Specific Styling

### Forms & Cards

- All forms (Login, Register, Account) will be wrapped in the `Card` component to preserve their established "box" look, with a distinct background (`bg-card`).
- Flashcards (`ManagedCard`, `ReviewableCard`) will also use the `Card` component as their base style, ensuring a consistent look.

### Interactive States & Animations

- **Card Flip:** The `StudyCard` will feature a 3D flip animation using CSS transforms (`transform-style: preserve-3d`, `perspective`, `rotateY`) and transitions.
- **Hover/Focus:** All interactive elements will have clear `hover:` and `focus-visible:` states (e.g., changing shadows, border colors, or showing a ring) for better usability.
- **Transitions:** Animation durations will be standardized in the Tailwind config (e.g., `duration-fast: '150ms'`) to create a consistent rhythm across the UI.

### Word Count Validator

- The text color will be dynamically updated based on state:
  - **Default:** Neutral color.
  - **Valid (1000-10000 words):** Green (`text-green-500`).
  - **Invalid (on submit attempt):** Red (`text-destructive`).

### Modals & Overlays

- Overlays (for modals or loading states) will use `position: fixed`, `inset-0`, a high `z-index`, and a `backdrop-blur-sm` effect for a modern, layered feel.

### Empty States

- A reusable `EmptyState.tsx` component will be created to handle views with no content (e.g., no cards to study). It will feature an icon, a heading, descriptive text, and a call-to-action `Button`.

## 5. Performance & Maintainability

### CSS Optimization

- Tailwind's JIT (Just-In-Time) compiler will automatically purge unused CSS classes from the production build, keeping the final stylesheet size minimal.

### Text Overflow

- The `@tailwindcss/line-clamp` plugin will be used to truncate long text in flashcard answers when they are displayed in a grid, ensuring a uniform layout.

### Code Style

- The Prettier plugin for Tailwind CSS will enforce a consistent and logical order for utility classes in all source files.
