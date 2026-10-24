import { Config, ConfigProvider, Effect, Equal, Exit, HashSet } from 'effect'
import { describe, expect, test } from 'vitest'
import { DbError } from '../db'

describe('effect basics', () => {
  test('error handling', async () => {
    const actual = await Effect.runPromiseExit(
      Effect.tryPromise({
        try: () => Promise.reject('test'),
        catch: (cause) => new DbError({ cause }),
      }),
    )

    expect(actual).toStrictEqual(Exit.fail(new DbError({ cause: 'test' })))
  })

  test('get config that is provided', () => {
    const mockConfigProvider = ConfigProvider.fromEnvRecord({
      MY_ENV_VAR: 'localhost',
    })
    const layer = ConfigProvider.layer(mockConfigProvider)

    const actual = Config.String('MY_ENV_VAR').pipe(
      Effect.provide(layer),
      Effect.runSync,
    )

    expect(actual).toBe('localhost')
  })

  test('HashSet equality with tokens', () => {
    const testData = [
      { devices: [{ token: 'hi' }] },
      { devices: [{ token: 'ho' }] },
      { devices: [{ token: 'more' }] },
      { devices: [{ token: 'hi' }, { token: 'more' }] },
    ]
    const tokens = testData
      .flatMap((guardian) => guardian.devices ?? [])
      .reduce(
        (acc, device) => acc.pipe(HashSet.add(device)),
        HashSet.empty<{ token: string }>(),
      )
      .pipe(
        HashSet.map((device) => device.token),
        Array.from,
      )
    expect(tokens.sort()).toStrictEqual(['hi', 'ho', 'more'])
  })

  test('HashSet equality with devices', () => {
    const guardian = { devices: [{ token: 'hi' }, { token: 'more' }] }

    const devices = HashSet.fromIterable(guardian.devices ?? []).pipe(
      HashSet.add({ token: 'more' }),
      Array.from,
    )
    expect(devices.length).toBe(2)
    expect(Equal.equals(devices[0], { token: 'more' })).toBe(true)
  })
})
