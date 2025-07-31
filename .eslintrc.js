// jest 的東西

module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true, // ✅ 告訴 ESLint: 這是使用 Jest 的環境
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['react', 'jest'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
}
