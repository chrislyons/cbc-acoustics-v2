import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Extend Vitest matchers if needed
expect.extend({
  toBeWithinTolerance(received: number, expected: number, tolerance: number = 0.001) {
    const pass = Math.abs(received - expected) <= tolerance
    return {
      pass,
      message: () =>
        `Expected ${received} to be within ${tolerance} of ${expected}, but difference was ${Math.abs(received - expected)}`,
    }
  },
})

// Extend TypeScript types for custom matchers
declare module 'vitest' {
  interface Assertion {
    toBeWithinTolerance(expected: number, tolerance?: number): void
  }
}
