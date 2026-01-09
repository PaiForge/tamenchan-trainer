import tseslint from "typescript-eslint";
import sharedConfig from "@tamenchan-trainer/eslint-config-custom";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "*.config.js", "*.config.mjs"],
  },
  ...sharedConfig.configs.base,
  {
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // コンテンツファイルは文字列データなので、ルールを緩和
    files: ["src/patterns/**/*.ts"],
    rules: {
      "@typescript-eslint/prefer-readonly-parameter-types": "off",
      "jsdoc/require-jsdoc": "off", // コンテンツデータにJSDocは不要
    },
  }
);
