module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>tests/setupTests.js"],
  testEnvironment: "enzyme",
  coverageReporters: [
    "html"
  ],
  moduleNameMapper: {
    "\\.(css|scss)$": "jest-css-modules"
  },
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  }
};
