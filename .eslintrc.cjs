module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es2020: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    requireConfigFile: false
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  rules: {}
};
