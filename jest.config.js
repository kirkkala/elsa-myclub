import nextJest from "next/jest.js"

const createJestConfig = nextJest({
  dir: "./",
})

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/pnpm-lock.yaml",
    "<rootDir>/.pnpm-store/",
    "<rootDir>/.next/",
    "<rootDir>/__tests__/mocks/",
  ],
}

export default createJestConfig(customJestConfig)
