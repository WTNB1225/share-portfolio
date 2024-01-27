module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  "moduleNameMapper": {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.module\\.css$': 'identity-obj-proxy',
  },
  "resolver": undefined,
  transform: {
      '^.+\\.module\\.css$': 'jest-transform-stub',
      '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
      '^.+\\.(js|jsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
};

