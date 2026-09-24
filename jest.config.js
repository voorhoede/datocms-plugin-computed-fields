const config = {
  testMatch: ['**/*.test.ts?(x)'],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/__mocks__/styleMock.js',
  },
}

module.exports = config
