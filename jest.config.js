module.exports = {
  "setupFilesAfterEnv": ["jest-enzyme"],
  "testEnvironment": "enzyme",
  "coverageReporters": [
    "html"
  ],
  "moduleNameMapper": {
    "\\.(css|scss)$": "jest-css-modules"
  },
};
