import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    exclude: ['src/test_e2e/**', 'node_modules/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/__tests__/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/db/database.types.ts', // Supabase generated types
        'src/components/ui/**', // Shadcn UI components, mostly presentational
        'src/pages/**', // Astro pages and API routes are tested via Supertest, not unit coverage
        'src/middleware/**',
        'src/env.d.ts',
        '**/*.astro',
        '**/*.d.ts',
        'src/test_e2e/**',
      ],
      include: [
        'src/lib/services/**', 
        'src/components/hooks/**', 
        'src/lib/utils.ts',
        'src/components/views/**',
      ],
    },
  },
  resolve: {
    alias: {
      '~': '/src',
    },
  },
});