import tseslint from "typescript-eslint";
import sharedConfig from "@tamenchan-trainer/eslint-config-custom";

export default tseslint.config(
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      "next-env.d.ts",
    ],
  },
  ...sharedConfig.configs.base,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    files: ["app/**/*.tsx", "app/**/*.ts"],
    rules: {
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
    },
  }
);
