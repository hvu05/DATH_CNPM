import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default defineConfig([
    globalIgnores(['dist', 'node_modules']),
    ...compat.extends('plugin:react/recommended'), // 👈 nếu bạn muốn có rule React cũ
    {
        files: ['**/*.{ts,tsx,js,jsx}'],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
        plugins: {
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier,
        },
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            // ⚠️ Không dùng reactHooks.configs['recommended-latest'] nữa
            // vì nó vẫn ở định dạng cũ
        ],
        rules: {
            'prettier/prettier': ['error'],
            'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        },
    },
]);
