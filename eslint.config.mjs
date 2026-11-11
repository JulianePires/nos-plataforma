import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

// Rules owned by Biome (ADR 0006): each rule runs in one tool only.
const biomeOwnedRules = Object.fromEntries(
  [
    "@typescript-eslint/no-array-constructor",
    "@typescript-eslint/no-duplicate-enum-values",
    "@typescript-eslint/no-explicit-any",
    "@typescript-eslint/no-extra-non-null-assertion",
    "@typescript-eslint/no-extraneous-class",
    "@typescript-eslint/no-invalid-void-type",
    "@typescript-eslint/no-misused-new",
    "@typescript-eslint/no-namespace",
    "@typescript-eslint/no-non-null-asserted-optional-chain",
    "@typescript-eslint/no-non-null-assertion",
    "@typescript-eslint/no-require-imports",
    "@typescript-eslint/no-unnecessary-type-constraint",
    "@typescript-eslint/no-unsafe-declaration-merging",
    "@typescript-eslint/no-unused-vars",
    "@typescript-eslint/no-useless-constructor",
    "@typescript-eslint/prefer-as-const",
    "@typescript-eslint/prefer-literal-enum-member",
    "@typescript-eslint/prefer-namespace-keyword",
    "@typescript-eslint/unified-signatures",
    "no-console",
    "no-var",
    "prefer-const",
    "prefer-rest-params",
    "prefer-spread",
  ].map((rule) => [rule, "off"]),
);

export default defineConfig(
  globalIgnores([
    "**/node_modules/**",
    "**/.next/**",
    "**/.turbo/**",
    "**/next-env.d.ts",
    "packages/db/src/database.types.ts",
  ]),
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    extends: [tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: biomeOwnedRules,
  },
  {
    files: ["apps/web/**/*.{ts,tsx,js,mjs}"],
    plugins: { "@next/next": nextPlugin },
    settings: { next: { rootDir: "apps/web/" } },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
  {
    files: ["**/*.{js,mjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
);
