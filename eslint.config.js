// ESLint configuration for Vue 3 + TypeScript + Prettier (ESM)
export default {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // stylistic choices — most formatting handled by Prettier
    'vue/html-indent': ['error', 2],
    indent: 'off', // handled by @typescript-eslint
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'vue/script-setup-uses-vars': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
// ESLint configuration for Vue 3 + TypeScript + Prettier
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    // stylistic choices — most formatting handled by Prettier
    'vue/html-indent': ['error', 2],
    indent: 'off', // handled by @typescript-eslint
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'vue/script-setup-uses-vars': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
