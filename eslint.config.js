import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier/flat';
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';

export default defineConfig(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  prettier,
);
