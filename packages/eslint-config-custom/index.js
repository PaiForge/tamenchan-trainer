const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const jsdoc = require("eslint-plugin-jsdoc");
const prettier = require("eslint-config-prettier");
const globals = require("globals");
const react = require("eslint-plugin-react");

module.exports = {
  configs: {
    base: tseslint.config(
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
            ...globals.browser,
          },
        },
      },
      {
        plugins: {
          jsdoc,
          react,
        },
        rules: {
          // 厳格なルール
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
              publicOnly: true,
            },
          ],
          "jsdoc/no-types": "error",

          // 調整
          "@typescript-eslint/restrict-template-expressions": "off",
          "@typescript-eslint/no-unused-vars": [
            "error",
            { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
          ],
          "@typescript-eslint/consistent-type-definitions": [
            "error",
            "interface",
          ],
          "@typescript-eslint/no-shadow": "error",
          "@typescript-eslint/no-wrapper-object-types": "error",
          "@typescript-eslint/consistent-type-assertions": [
            "error",
            {
              assertionStyle: "never",
            },
          ],

          // JSDoc
          "jsdoc/require-param": "off",
          "jsdoc/require-returns": "off",

          // React
          "react/jsx-uses-react": "off",
          "react/react-in-jsx-scope": "off",
        },
      },
      prettier,
    ),
  },
};
