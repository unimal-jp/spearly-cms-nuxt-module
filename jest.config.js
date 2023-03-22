export default {
  roots: ['<rootDir>'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  moduleNameMapper: {
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['js', 'ts', 'vue', 'json', 'tsx', 'node'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/specs/**/*.spec.{js,ts}',
  ],
}
