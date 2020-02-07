module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true
  },
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'warn',
    semi: [2, 'never'],
    'vue/script-indent': ['error', 2, { baseIndent: 1 }],
    indent: 'off',
    'vue/script-indent': [
      'warn',
      2,
      {
        baseIndent: 1
      }
    ]
  },
  globals: {
    $nuxt: true
  },
  extends: ['@nuxtjs/eslint-config-typescript']
}
