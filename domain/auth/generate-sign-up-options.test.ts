import { DB } from '@/adapter/db'
import * as schema from '@/adapter/db/schema'
import { PassKey, PassKeyTest } from '@/adapter/pass-key'
import { AlreadyRegistered } from '@/app/(auth)/errors'
import { Effect, Layer } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, it, vi } from 'vitest'
import { UserRepository, UserRepositoryLive } from '../user/repository'
import { generateSignUpOptionsEffect } from './generate-sign-up-options'

const userNoAuthenticator = {
  id: '1',
  username: 'user',
  currentChallenge: null,
  authenticators: [],
}
const userAuthenticator = {
  id: '1',
  username: 'user',
  currentChallenge: null,
  authenticators: ['has authenticator'],
}
describe('generateSignUpOptionsEffect', () => {
  it('registers new users', () =>
    Effect.gen(function* ($) {
      const actual = yield* $(generateSignUpOptionsEffect('user'))

      expect(actual).toEqual({
        challenge: 'challenge',
        user: { displayName: 'user', id: '1', name: 'user' },
      })
    }).pipe(
      runTest({
        existingUser: null,
        newUser: userNoAuthenticator,
      })
    ))

  it('registers existing users without authenticators', () =>
    Effect.gen(function* ($) {
      const actual = yield* $(generateSignUpOptionsEffect('user'))

      expect(actual).toEqual({
        challenge: 'challenge',
        user: { displayName: 'user', id: '1', name: 'user' },
      })
    }).pipe(
      runTest({
        existingUser: userNoAuthenticator,
        newUser: null,
      })
    ))

  it('fails with already registered user', () =>
    Effect.gen(function* ($) {
      const actual = yield* $(generateSignUpOptionsEffect('user'), Effect.flip)
      expect(actual).toBeInstanceOf(AlreadyRegistered)
    }).pipe(
      runTest({
        existingUser: userAuthenticator,
        newUser: null,
      })
    ))
})

type DbUser =
  | (schema.SelectUsers & {
      authenticators: string[]
    })
  | null

const runTest =
  (queryData: { existingUser: DbUser; newUser: DbUser }) =>
  (effect: Effect.Effect<UserRepository | PassKey, any, any>) => {
    const queryMock = vi.fn()
    queryMock.mockImplementationOnce(() =>
      Effect.succeed(queryData.existingUser)
    )
    queryMock.mockImplementationOnce(() => Effect.succeed(null))
    queryMock.mockImplementationOnce(() => Effect.succeed(queryData.newUser))
    queryMock.mockImplementationOnce(() => Effect.succeed(null))
    const DbTest = Layer.succeed(
      DB,
      DB.of(
        mock({
          query: queryMock,
        })
      )
    )

    const UserRepositoryTest = UserRepositoryLive.pipe(Layer.provide(DbTest))

    const mainTest = Layer.mergeAll(UserRepositoryTest, PassKeyTest)

    return effect.pipe(Effect.provide(mainTest), Effect.runPromise)
  }
