import { DB } from '@/adapter/db'
import { Effect, Layer, Option } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, it } from 'vitest'
import { makeUser } from './example-data'
import { UserRepository } from './repository'

describe('user repository', () => {
  it('finds user by email', () =>
    Effect.gen(function* ($) {
      const user = yield* $(UserRepository.findByUsername('philip@co2data.org'))
      expect(user).toEqual(Option.some(makeUser()))
    }).pipe(
      runTest({
        queryResult: {
          id: '1',
          username: 'philip@co2data.org',
          currentChallenge: null,
          authenticators: [],
        },
      }),
    ))

  it('finds no user by email', () =>
    Effect.gen(function* ($) {
      const user = yield* $(UserRepository.findByUsername('unknown@user.org'))
      expect(user).toStrictEqual(Option.none())
    }).pipe(
      runTest({
        queryResult: null,
      }),
    ))
})

const runTest =
  // biome-ignore lint/suspicious/noExplicitAny: Test
    (testData: { queryResult: any }) =>
    // biome-ignore lint/suspicious/noExplicitAny: Test
    (effect: Effect.Effect<any, any, UserRepository>) => {
      const DbTest = Layer.succeed(
        DB,
        DB.of(
          mock({
            query: mock(() => Effect.succeed(testData.queryResult)),
          }),
        ),
      )

      const UserRepositoryTest = UserRepository.Test(DbTest)

      return effect.pipe(Effect.provide(UserRepositoryTest), Effect.runPromise)
    }
