import { DB } from '@/adapter/db'
import { PassKey, PassKeyTest } from '@/adapter/pass-key'
import { AlreadyRegistered } from '@/app/auth/errors'
import { Effect, Layer } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, it, vi } from 'vitest'
import { UserRepository, UserRepositoryLive } from '../user/repository'
import { generateSignUpOptionsEffect } from './generate-sign-up-options'

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
        newUser: { id: '1', email: 'user', authenticators: [] },
      })
    ))

  it('registers existing users without authenticators', () =>
    Effect.gen(function* ($) {
      const actual = yield* $(generateSignUpOptionsEffect('user'))

      expect(actual).toEqual({
        challenge: 'challenge',
        user: { displayName: 'user', id: '2', name: 'user' },
      })
    }).pipe(
      runTest({
        existingUser: { id: '2', email: 'user', authenticators: [] },
        newUser: null,
      })
    ))

  it('fails with already registered user', () =>
    Effect.gen(function* ($) {
      const actual = yield* $(generateSignUpOptionsEffect('user'), Effect.flip)
      expect(actual).toBeInstanceOf(AlreadyRegistered)
    }).pipe(
      runTest({
        existingUser: {
          id: 1,
          email: 'user',
          authenticators: ['has authenticator'],
        },
        newUser: null,
      })
    ))
})

const runTest =
  (queryData: { existingUser: any; newUser: any }) =>
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
