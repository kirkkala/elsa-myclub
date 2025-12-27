import "@testing-library/jest-dom"

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}))

// Suppress the specific jsdom navigation warning that doesn't affect functionality
const originalConsoleError = console.error

beforeAll(() => {
  console.error = (...args) => {
    // Check if this is the jsdom navigation error by looking at the error message
    const errorString = String(args[0])

    if (errorString.includes("Not implemented: navigation")) {
      return // Silently ignore this specific error
    }

    // For all other errors, use the original console.error
    originalConsoleError(...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
})
