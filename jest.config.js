/** @type {import('ts-jest').JestConfigWithTsJest} */

export default {
  roots: ['<rootDir>/src/'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
};
