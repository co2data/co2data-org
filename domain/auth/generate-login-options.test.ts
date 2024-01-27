import { DB } from '@/adapter/db'
import { PassKey, PassKeyTest } from '@/adapter/pass-key'
import { UserRepository, UserRepositoryLive } from '@/domain/user/repository'
import { Effect, Either, Layer } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, it } from 'vitest'
import { NoUserFound } from '../../app/auth/errors'
import { generateLoginOptionsEffect } from './generate-login-options'

describe('generateLoginOptions', () => {
  it('runs happy path', async () =>
    Effect.gen(function* ($) {
      const actual = yield* $(
        generateLoginOptionsEffect('philip@co2data.org')
      )
      expect(actual).toMatchInlineSnapshot(`
        {
          "challenge": "challenge",
          "json": "hi",
        }
      `)
    }).pipe(
      runTest({
        id: 'id',
        email: 'philip@co2data.org',
        currentChallenge: null,
        authenticators: [
          {
            userId: 'philip@co2data.org',
            credentialId: 'credentialId',
            credentialPublicKey: 'credentialPublicKey',
            counter: 8,
            credentialDeviceType: 'device',
            credentialBackedUp: true,
            transports: null,
          },
        ],
      })
    ))

  it("can't find the user", () =>
    Effect.gen(function* ($) {
      const actual = yield* $(
        generateLoginOptionsEffect('unknown@user.org'),
        Effect.either
      )

      expect(actual).toEqual(Either.left(new NoUserFound()))
    }).pipe(runTest(null)))
})

const runTest =
  (queryData: any) =>
  (effect: Effect.Effect<UserRepository | PassKey, any, any>) => {
    const DbTest = Layer.succeed(
      DB,
      DB.of(
        mock({
          query: mock(() => Effect.succeed(queryData)),
        })
      )
    )

    const UserRepositoryTest = UserRepositoryLive.pipe(Layer.provide(DbTest))

    const mainTest = Layer.mergeAll(UserRepositoryTest, PassKeyTest)

    return effect.pipe(Effect.provide(mainTest), Effect.runPromise)
  }
