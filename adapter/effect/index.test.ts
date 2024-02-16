import {
  Config,
  ConfigProvider,
  Data,
  Effect,
  Exit,
  HashSet,
  Layer,
  ReadonlyArray,
} from 'effect'
import { describe, expect, it, test } from 'vitest'
import { DbError } from '../db'

describe('effect basics', () => {
  test('error handling', async () => {
    const actual = await Effect.tryPromise({
      try: () => Promise.reject('test'),
      catch: (cause) => new DbError({ cause }),
    }).pipe(Effect.runPromiseExit)

    expect(actual).toStrictEqual(Exit.fail(new DbError({ cause: 'test' })))
  })

  test('get config that is provided', () => {
    const mockConfigProvider = ConfigProvider.fromMap(
      new Map([['MY_ENV_VAR', 'localhost']]),
    )
    const layer = Layer.setConfigProvider(mockConfigProvider)

    const actual = Config.string('MY_ENV_VAR').pipe(
      Effect.provide(layer),
      Effect.runSync,
    )

    expect(actual).toBe('localhost')
  })

  test('get config that is not provided', async () => {
    expect(
      Effect.runPromise(Config.string('MY_ENV_VAR')),
    ).rejects.toMatchInlineSnapshot(
      `[(Missing data at MY_ENV_VAR: "Expected MY_ENV_VAR to exist in the process context")]`,
    )
  })

  test('HashSet equality with tokens', () => {
    const testData = [
      { devices: [{ token: 'hi' }] },
      { devices: [{ token: 'ho' }] },
      { devices: [{ token: 'more' }] },
      { devices: [{ token: 'hi' }, { token: 'more' }] },
    ]
    const tokens = HashSet.fromIterable(testData).pipe(
      HashSet.flatMap((guardian) =>
        HashSet.fromIterable(guardian.devices ?? []),
      ),
      HashSet.map((device) => device.token),
      ReadonlyArray.fromIterable,
    )
    expect(tokens).toMatchInlineSnapshot(`
      [
        "ho",
        "hi",
        "more",
      ]
    `)
  })

  test('HashSet equality with devices', () => {
    const guardian = { devices: [{ token: 'hi' }, { token: 'more' }] }

    const devices = HashSet.fromIterable(
      guardian.devices.map(Data.struct) ?? [],
    ).pipe(
      HashSet.add(Data.struct({ token: 'more' })),
      ReadonlyArray.fromIterable,
    )
    expect(devices).toMatchInlineSnapshot(`
      [
        {
          "token": "more",
        },
        {
          "token": "hi",
        },
      ]
    `)
  })
  test('Equality with devices without HashSet', () => {
    const guardian = { devices: [{ token: 'hi' }, { token: 'more' }] }

    const devices = HashSet.fromIterable(guardian.devices ?? []).pipe(
      HashSet.add({ token: 'more' }),
      ReadonlyArray.fromIterable,
    )
    expect(devices.length).toBe(3)
  })
})
