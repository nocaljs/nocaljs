import js from '@eslint/js'
import globals from 'globals'

export default [
    { ignores: ['**/node_modules/**', '**/dist/**', '**/vendor/**', '**/spec/**', '**/.venv/**', 'build/**', 'packages/nocaljs-docs/site/**', 'packages/nocaljs-autodocs/**'] },
    {
        files: ['src/**/*.mjs', 'scripts/**/*.mjs', 'tests/**/*.mjs', 'packages/*/src/**/*.mjs', 'packages/*/tests/**/*.mjs', 'packages/*/webpack.config.js', 'apps/site/**/*.js', 'examples/counter/**/*.mjs', '*.config.{js,mjs}'],
        ...js.configs.recommended,
        languageOptions: { globals: { ...globals.browser, ...globals.node }, sourceType: 'module' },
        rules: { ...js.configs.recommended.rules, 'no-unused-vars': 'off', 'no-empty': ['error', { allowEmptyCatch: true }] }
    },
    { files: ['**/webpack.config.js'], languageOptions: { sourceType: 'commonjs' } }
]
