import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
export default tseslint.config(
 { ignores: ['**/node_modules/**','**/.next/**','**/dist/**','.nx/**','coverage/**','playwright-report/**','test-results/**','**/next-env.d.ts'] },
 js.configs.recommended, ...tseslint.configs.recommended,
 { languageOptions: { globals: { ...globals.node, ...globals.browser } } },
 { files: ['**/*.tsx'], plugins: { 'react-hooks': hooks }, rules: hooks.configs.recommended.rules },
 { files: ['apps/storefront/**/*.{ts,tsx}','apps/*-panel/**/*.{ts,tsx}','libs/**/*.{ts,tsx}'], rules: { 'no-restricted-imports': ['error', { patterns: ['**/apps/api/**','@nestjs/*','@prisma/*'] }] } }
);

