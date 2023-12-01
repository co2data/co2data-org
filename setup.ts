import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  cleanup()
})
