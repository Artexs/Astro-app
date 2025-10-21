### Analysis of `global.css`

The current stylesheet uses a custom set of design tokens for colors and corner radii, implemented as CSS custom properties for both light and dark modes. It leverages Tailwind CSS for utility classes and base styling. The colors are defined using the modern `oklch()` color function, and a prominent feature is the complex gradient background on the `<body>`.

To align with Fluent UI 2, a systematic update of these foundational tokens is required. The goal is to replace the current bespoke design system with Fluent UI's well-defined and accessible tokens.

### Change Plan: Adopting Fluent UI 2 Tokens

The transformation will focus on updating the core design tokens in `:root` and `.dark` scopes. This will ensure the changes propagate throughout the application wherever these variables are used.

#### 1. Color System Overhaul

The most critical change is to map the existing color variables to the Fluent UI 2 color palette. This will not only provide the look and feel of Fluent but also ensure accessibility, as Fluent's tokens are designed with sufficient contrast ratios.

**Light Mode (`:root`) Modifications:**

*   `--background`: Replace `oklch(1 0 0)` with Fluent's `colorNeutralBackground1` (`#FFFFFF`).
*   `--foreground`: Replace `oklch(0.145 0 0)` with `colorNeutralForeground1` (`#242424`).
*   `--card`, `--popover`: Replace with `colorNeutralBackground1` (`#FFFFFF`) or `colorNeutralBackground2` (`#FAFAFA`) for a subtle distinction.
*   `--primary`: Replace with a Fluent brand color, like `colorBrandBackground` (`#0F6CBD`).
*   `--primary-foreground`: Replace with `colorNeutralForegroundOnBrand` (`#FFFFFF`).
*   `--border`, `--input`: Replace with `colorNeutralStroke1` (`#D1D1D1`).
*   `--destructive`: Replace with a Fluent error/destructive color, like `colorPaletteRedBackground3` (`#A80000`).

**Dark Mode (`.dark`) Modifications:**

*   `--background`: Replace `oklch(0.145 0 0)` with `colorNeutralBackground1` (`#292929`).
*   `--foreground`: Replace `oklch(0.985 0 0)` with `colorNeutralForeground1` (`#FFFFFF`).
*   `--card`, `--popover`: Replace with `colorNeutralBackground2` (`#333333`).
*   `--primary`: Replace with the dark theme brand color, `colorBrandBackground` (`#2899F5`).
*   `--border`, `--input`: Replace with `colorNeutralStroke1` (`#424242`).
*   `--destructive`: Replace with the dark theme destructive color, like `colorPaletteRedForeground1` (`#F1707B`).

#### 2. Corner Radius (Shape) Adjustment

Fluent UI 2 uses a subtle and consistent corner radius scale. The current base radius is `0.625rem` (10px), which is larger than Fluent's standard.

*   **Action:** Update the `--radius` variable to a value from the Fluent UI 2 ramp, such as `0.375rem` (6px) or `0.25rem` (4px). This change will automatically propagate to the derived `--radius-sm`, `--radius-md`, etc., creating a more refined and consistent shape language across components like buttons and cards.

#### 3. Base Style Simplification

The current `body` background is a prominent multi-color gradient. While visually interesting, it is not characteristic of Fluent UI's focus on clean, layered interfaces.

*   **Action:** Remove the `background: linear-gradient(...)` from the `body` style in `@layer base`. The body should instead inherit the primary background color by setting `background-color: var(--background)`. This will create a solid, neutral canvas that improves content readability and aligns with modern application design.

#### 4. Typography (Recommendation)

While not directly controlled in `global.css`, typography is a core part of Fluent UI.

*   **Action:** It is recommended to update the Tailwind configuration (`tailwind.config.js`) to use "Segoe UI Variable" or a similar system font stack as the default font family. Furthermore, the theme's font sizes should be mapped to Fluent's type ramp to ensure a consistent and accessible typographic hierarchy.

By implementing these token-level changes, the application will adopt the modern, accessible, and cohesive aesthetic of Fluent UI 2 while maintaining the existing structure of the codebase.
