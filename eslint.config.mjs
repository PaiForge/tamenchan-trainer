import js from "@eslint/js";
import tseslint from "typescript-eslint";
import jsdoc from "eslint-plugin-jsdoc";
import prettier from "eslint-config-prettier";
import globals from "globals";
import react from "eslint-plugin-react";

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**", "eslint.config.mjs", ".expo/**", "web-build/**"],
    },
    js.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.es2021,
                ...globals.browser, // React Native often implies browser-like env for some APIs
            },
            parserOptions: {
                project: ["./tsconfig.eslint.json"],
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
    },
    {
        plugins: {
            jsdoc,
            react,
        },
        rules: {
            // User requested strict rules
            "@typescript-eslint/prefer-readonly-parameter-types": [
                "error",
                {
                    ignoreInferredTypes: true,
                },
            ],
            "jsdoc/require-jsdoc": [
                "error",
                {
                    require: {
                        FunctionDeclaration: true,
                        MethodDefinition: true,
                        ClassDeclaration: true,
                        ArrowFunctionExpression: false,
                        FunctionExpression: false,
                    },
                    publicOnly: true, // Exported ONLY
                },
            ],
            "jsdoc/no-types": "error", // Use TypeScript types, not JSDoc types

            // Adjustments for project
            "@typescript-eslint/restrict-template-expressions": "off", // Often useful to log things
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/consistent-type-definitions": ["error", "interface"],

            // Additional user requests
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/consistent-type-assertions": [
                "error",
                {
                    assertionStyle: "never",
                },
            ],

            // JSDoc additional settings
            "jsdoc/require-param": "off", // TS checks params
            "jsdoc/require-returns": "off", // TS checks returns

            // React specific
            "react/jsx-uses-react": "off",
            "react/react-in-jsx-scope": "off",
        },
    },
    {
        files: ["**/*.test.ts", "**/*.test.tsx"],
        rules: {
            "@typescript-eslint/consistent-type-assertions": "off",
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
        },
    },
    // Add specific ignores for Expo/React Native files that might be tricky
    {
        files: ["metro.config.js", "babel.config.js", "tailwind.config.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off", // Config files often use require
            "@typescript-eslint/no-var-requires": "off",
        }
    },
    prettier, // Must be last
);
