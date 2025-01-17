import pluginJs from '@eslint/js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import globals from 'globals';
import tseslint from 'typescript-eslint';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: [ '**/*.{js,mjs,cjs,ts}' ]
  },
  {
    languageOptions: { globals: globals.browser }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      '@stylistic/ts': stylisticTs
    }
  },
  {
    rules: {
      '@stylistic/ts/indent': [ 'error', 2 ],
      'max-len': [ 'error', { 'code': 180 } ],
      'quotes': [ 'error', 'single' ],
      'arrow-parens': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ],
      'object-curly-spacing': [ 'error', 'always', { 'arraysInObjects': true, 'objectsInObjects': true } ],
      'comma-spacing': [ 'error', { 'before': false, 'after': true } ],
      'semi': [ 'error', 'always' ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: [ '**/*.cy.ts' ],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off'
    }
  }
];
