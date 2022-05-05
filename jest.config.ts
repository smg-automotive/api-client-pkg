export default {
  automock: false,
  clearMocks: true,
  collectCoverage: false,
  errorOnDeprecated: true,
  moduleDirectories: ['node_modules', '<rootDir>'],
  preset: 'ts-jest/presets/js-with-ts',
  restoreMocks: true,
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/.jest/setup/fetch.ts'],
  setupFilesAfterEnv: ['<rootDir>/.jest/setup/jestDomExpects.ts'],
  testEnvironment: 'jsdom',
}
