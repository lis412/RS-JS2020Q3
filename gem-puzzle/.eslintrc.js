module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/*'],
  rules: {
    'linebreak-style': 'off',
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
};
