import { DB } from '@/adapter/db'
import { PassKey } from '@/adapter/pass-key'
import { UserRepository } from '@/domain/user/repository'
import { Effect, Layer } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, it } from 'vitest'
import { NoUserFound } from '../../app/(auth)/errors'
import { generateLoginOptionsEffect } from './generate-login-options'

describe('generateLoginOptions', () => {
  it('runs happy path', async () =>
    Effect.gen(function* ($) {
      const actual = yield* $(generateLoginOptionsEffect('philip@co2data.org'))
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
      }),
    ))

  it("can't find the user", () =>
    Effect.gen(function* ($) {
      const actual = yield* $(
        generateLoginOptionsEffect('unknown@user.org'),
        Effect.flip,
      )

      expect(actual).toBeInstanceOf(NoUserFound)
    }).pipe(runTest(null)))
})

const runTest =
  (queryData: unknown) =>
  (effect: Effect.Effect<unknown, unknown, UserRepository | PassKey>) => {
    const DbTest = Layer.succeed(
      DB,
      DB.of(
        mock({
          query: mock(() => Effect.succeed(queryData)),
        }),
      ),
    )

    const UserRepositoryTest = UserRepository.Live.pipe(Layer.provide(DbTest))

    const mainTest = Layer.mergeAll(UserRepositoryTest, PassKey.Test)

    return effect.pipe(Effect.provide(mainTest), Effect.runPromise)
  }
