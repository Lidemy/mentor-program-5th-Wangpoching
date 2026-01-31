module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: '@lidemy/eslint-config-lidemy',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020
  },
  rules: {
    'no-console': 'off',
    'import/extensions': [
      'error',
      {
        js: 'ignorePackages'
      }
    ]
  }
}
