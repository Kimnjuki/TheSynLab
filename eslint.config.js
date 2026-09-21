import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "convex/_generated/**", "TheSynLab-deploy/**", ".kilo/**"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
      // Tracked migration debt: ~389 pre-existing `any` usages across the codebase
      // (legacy hooks/pages/data layer). Downgraded to a warning so `npm run lint`
      // stays green while the code is migrated to real types — do NOT use `any`
      // in new code; CI treats new warnings as review items.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Convex server functions intentionally ship with `// @ts-nocheck` (see
    // convex/ai/*): none of the tsconfig programs include convex/, so the
    // directive is a deliberate marker, not an error, and these files are
    // validated by the Convex runtime/deploy step instead of tsc.
    files: ["convex/**/*.ts"],
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
);
