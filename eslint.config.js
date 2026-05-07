import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

const browserGlobals = {
  Blob: "readonly",
  URL: "readonly",
  confirm: "readonly",
  document: "readonly",
  localStorage: "readonly",
  window: "readonly"
};

const nodeGlobals = {
  console: "readonly",
  process: "readonly"
};

export default [
  {
    ignores: ["**/dist/**", "**/node_modules/**"]
  },
  js.configs.recommended,
  {
    files: ["server/src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: nodeGlobals
    }
  },
  {
    files: ["client/src/**/*.{js,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: browserGlobals
    },
    rules: {
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }]
    }
  },
  {
    files: ["client/src/context/**/*.jsx"],
    rules: {
      "react-refresh/only-export-components": "off"
    }
  }
];
