module.exports = {
  transform: {
    // 只有使用 jset 時才用 babel
    '^.+\\.[jt]sx?$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
  },
}
