import { http } from 'msw'
import { setupServer } from 'msw/node'
import { expect } from 'vitest'
import { encode } from './planetScaleCodec'

console.log('Starting mock server.')
export const server = setupServer()

server.listen({ onUnhandledRequest: 'error' })

const requestFrame = (data: any) => ({
  session: {
    signature: 'jgw5Mh/rj6TK4Q4UzUYxjlxqww4ntxWFTkFniblAiIY=',
    vitessSession: {
      autocommit: true,
      options: [Object],
      foundRows: '1',
      rowCount: '-1',
      DDLStrategy: 'direct',
      SessionUUID: 'byNhYfIAV1ccarSkEIT3CA',
      enableSystemSettings: true,
    },
  },
  result: data,
  timing: 0.004300454,
})

export const mockPlanetScale = (response: any) => {
  server.use(
    http.post(/psdb/i, async ({ request }) => {
      console.log('Mocking PlanetScale with test data...')
      return Response.json(requestFrame(encode(response)))
    })
  )
}

export const recordNetworkToSnapshot = () => {
  server.use(
    http.all(/psdb/i, async ({ request }) => {
      console.log('Mocking PlanetScale and returning original data...')

      const originalResponse = await fetch(request)
      const originalResponseData = await originalResponse.json()

      expect(originalResponseData).toMatchSnapshot()

      return Response.json(originalResponseData)
    })
  )
}
