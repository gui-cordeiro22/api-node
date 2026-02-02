import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            indent: ["error", 4],
            semi: ["error", "always"],
            quotes: ["error", "double"],
            "@typescript-eslint/no-unused-vars": "warn",
        },
    },
];
