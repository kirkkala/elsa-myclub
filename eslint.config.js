import js from "@eslint/js"
import typescript from "@typescript-eslint/eslint-plugin"
import typescriptParser from "@typescript-eslint/parser"
import nextPlugin from "@next/eslint-plugin-next"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import importPlugin from "eslint-plugin-import"
import globals from "globals"

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
        React: "readonly",
        JSX: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      "@next/next": nextPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      // Extend recommended configs
      ...typescript.configs["strict-type-checked"].rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      // Overrides
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",

      // Import ordering
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"]],
          pathGroups: [{ pattern: "@/**", group: "internal", position: "before" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
    settings: {
      react: { version: "detect" },
      next: { rootDir: "." },
      "import/resolver": { typescript: true, node: true },
    },
  },
  // Environment overrides
  {
    files: ["app/api/**/*.{js,ts}"],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    files: ["app/**/page.tsx", "app/**/layout.tsx"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
  {
    files: ["**/*.test.{js,ts,tsx}", "**/__tests__/**/*.{js,ts,tsx}", "jest.setup.js"],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
    rules: { "@typescript-eslint/no-non-null-assertion": "off" },
  },
  {
    files: ["next.config.js", "jest.setup.js", "jest.config.js"],
    languageOptions: { sourceType: "module", globals: { ...globals.node } },
  },
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "dist/**", "eslint.config.js"],
  },
]
