module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['plugin:prettier/recommended', 'plugin:vue/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'vue/one-component-per-file': 'off',
    'vue/require-default-prop': 'off',
    'prettier/prettier': [
      'error',
      {
        semi: false,
        bracketSpacing: true,
        singleQuote: true,
        arrowParens: 'always',
        printWidth: 120,
      },
    ],
  },
}
