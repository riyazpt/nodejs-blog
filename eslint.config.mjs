import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node, // This is for Node.js environment
    },
    plugins: {
      js: pluginJs,
    },
    rules: {
      // Add any rules specific to Node.js here
    },
  },
  {
    files: ["**/*.browser.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        document: "readonly",
        window: "readonly",
      },
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  pluginJs.configs.recommended,
];
