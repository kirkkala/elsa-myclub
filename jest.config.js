import nextJest from "next/jest.js"

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    "^@/utils/(.*)$": "<rootDir>/utils/$1",
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/__tests__/mocks/",
  ],
}

export default createJestConfig(customJestConfig)
