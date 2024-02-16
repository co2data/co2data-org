import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

vi.mock('server-only', () => ({}))

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  cleanup()
})
