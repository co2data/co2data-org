import { DB, DbError } from '@/adapter/db'
import * as schema from '@/adapter/db/schema'
import { uInt8ArrayToUrlBase64 } from '@/lib/utils'
import { VerifiedRegistrationResponse } from '@simplewebauthn/server'
import { CredentialDeviceType } from '@simplewebauthn/types'
import { eq } from 'drizzle-orm'
import { Context, Data, Effect, Layer, Option, Predicate } from 'effect'
import { User } from '.'

interface _UserRepository {
  createUser: (username: string) => Effect.Effect<User, DbError>
  findByUsername: (
    username: string,
  ) => Effect.Effect<Option.Option<User>, DbError>
  setCurrentChallenge: (
    userId: string,
    currentChallenge: string,
  ) => Effect.Effect<void, DbError | CouldNotSetChallenge>
  addAuthenticator: (
    userId: string,
    registrationInfo: NonNullable<
      VerifiedRegistrationResponse['registrationInfo']
    >,
  ) => Effect.Effect<void, DbError>
  updateCounter: (
    userId: string,
    counter: number,
  ) => Effect.Effect<void, DbError>
}

const make = Effect.gen(function* ($) {
  const database = yield* $(DB)

  return UserRepository.of({
    createUser: (username) =>
      database
        .query((_) => _.insert(schema.users).values({ username }))
        .pipe(
          Effect.andThen(
            database.query((_) =>
              _.query.users.findFirst({
                where: eq(schema.users.username, username),
              }),
            ),
          ),
          Effect.filterOrFail(
            Predicate.isNotNullable,
            (_) =>
              new DbError({ cause: `Could not find created user ${username}` }),
          ),
          Effect.map((user) => ({
            ...user,
            currentChallenge: Option.none(),
            authenticators: [],
          })),
          Effect.tap((_) => Effect.logTrace(`id: ${username}`)),
          Effect.withSpan('createUser'),
        ),
    findByUsername: (username) =>
      database
        .query((_) =>
          _.query.users.findFirst({
            where: eq(schema.users.username, username),
            with: { authenticators: true },
          }),
        )
        .pipe(
          Effect.map(Option.fromNullable),
          Effect.map(Option.map(userFromDbToDomain)),
          Effect.tap((_) => Effect.logTrace(`id: ${username}`)),
          Effect.withSpan('getUserByName'),
        ),

    setCurrentChallenge: (userId, currentChallenge) =>
      database
        .query((_) =>
          _.update(schema.users)
            .set({ currentChallenge })
            .where(eq(schema.users.id, userId)),
        )
        .pipe(Effect.withSpan('setCurrentChallenge')),
    addAuthenticator: (userId, registrationInfo) =>
      database
        .query((_) => {
          const authenticator = {
            userId: userId,
            counter: registrationInfo.counter as unknown as bigint,
            credentialBackedUp: registrationInfo.credentialBackedUp,
            credentialDeviceType: registrationInfo.credentialDeviceType,
            credentialId: uInt8ArrayToUrlBase64(registrationInfo.credentialID),
            // saving as varbinary/binary/blob gets me some strange base64 back that I don't know how to convert to Uint8Array back...
            // I'm converting it to base64 myself and handel conversion back myself
            credentialPublicKey: uInt8ArrayToUrlBase64(
              registrationInfo.credentialPublicKey,
            ),
          } satisfies typeof schema.authenticators.$inferInsert
          return _.insert(schema.authenticators).values(authenticator)
        })
        .pipe(Effect.withSpan('addAuthenticator')),
    updateCounter: (userId, counter) =>
      database
        .query((_) =>
          _.update(schema.authenticators)
            .set({ counter: counter as unknown as bigint })
            .where(eq(schema.authenticators.userId, userId)),
        )
        .pipe(Effect.withSpan('updateCounter')),
  })
})

export class UserRepository extends Context.Tag('@services/UserRepository')<
  UserRepository,
  _UserRepository
>() {
  static Live = Layer.effect(this, make)
}

type UserWithAuthenticators = {
  id: string
  username: string
  currentChallenge: string | null
  authenticators: {
    userId: string
    credentialId: string
    credentialPublicKey: string
    counter: bigint
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports: AuthenticatorTransport[] | null
  }[]
}

function userFromDbToDomain(user: UserWithAuthenticators): User {
  return {
    ...user,
    currentChallenge: Option.fromNullable(user.currentChallenge),
    authenticators: user.authenticators.map((_) => ({
      counter: _.counter as unknown as number,
      credentialBackedUp: _.credentialBackedUp,
      credentialID: _.credentialId,
      ...(_.transports ? { transports: _.transports } : {}),
      credentialPublicKey: _.credentialPublicKey,
      credentialDeviceType: _.credentialDeviceType as CredentialDeviceType,
    })),
  }
}

class CouldNotSetChallenge extends Data.TaggedError(
  'CouldNotSetChallengeError',
) {}
