import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './infra/mock/server'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
