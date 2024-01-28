import { DB, DbError } from '@/adapter/db'
import * as schema from '@/adapter/db/schema'
import { uInt8ArrayToUrlBase64 } from '@/lib/utils'
import { VerifiedRegistrationResponse } from '@simplewebauthn/server'
import { CredentialDeviceType } from '@simplewebauthn/types'
import { eq } from 'drizzle-orm'
import { Context, Data, Effect, Layer, Option, Predicate } from 'effect'
import { User } from '.'

export interface UserRepository {
  createUser: (username: string) => Effect.Effect<never, DbError, User>
  findByEmail: (
    email: string
  ) => Effect.Effect<never, DbError, Option.Option<User>>
  setCurrentChallenge: (
    userId: string,
    currentChallenge: string
  ) => Effect.Effect<never, DbError | CouldNotSetChallenge, void>
  addAuthenticator: (
    userId: string,
    registrationInfo: NonNullable<
      VerifiedRegistrationResponse['registrationInfo']
    >
  ) => Effect.Effect<never, DbError, void>
  updateCounter: (
    userId: string,
    counter: number
  ) => Effect.Effect<never, DbError, void>
}

export const UserRepository = Context.Tag<UserRepository>()

export const UserRepositoryLive = DB.pipe(
  Effect.map(make),
  Layer.effect(UserRepository)
)

function make(database: DB): UserRepository {
  return UserRepository.of({
    createUser: (username) =>
      database
        .query((_) => _.insert(schema.users).values({ email: username }))
        .pipe(
          Effect.andThen(
            database.query((_) =>
              _.query.users.findFirst({
                where: eq(schema.users.email, username),
              })
            )
          ),
          Effect.filterOrFail(
            Predicate.isNotNullable,
            (_) =>
              new DbError({ cause: `Could not find created user ${username}` })
          ),
          Effect.map((user) => ({
            ...user,
            currentChallenge: Option.none(),
            authenticators: [],
          }))
        ),
    findByEmail: (email) =>
      database
        .query((_) =>
          _.query.users.findFirst({
            where: eq(schema.users.email, email),
            with: { authenticators: true },
          })
        )
        .pipe(
          Effect.map(Option.fromNullable),
          Effect.map(Option.map(userFromDbToDomain)),
          Effect.tap((_) => Effect.logTrace(`id: ${email}`)),
          Effect.withSpan('getUserByEmail')
        ),

    setCurrentChallenge: (userId, currentChallenge) =>
      database
        .query((_) =>
          _.update(schema.users)
            .set({ currentChallenge })
            .where(eq(schema.users.id, userId))
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
              registrationInfo.credentialPublicKey
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
            .where(eq(schema.authenticators.userId, userId))
        )
        .pipe(Effect.withSpan('updateCounter')),
  })
}

type UserWithAuthenticators = {
  id: string
  email: string
  currentChallenge: string | null
  authenticators: {
    userId: string
    credentialId: string
    credentialPublicKey: string
    counter: bigint
    credentialDeviceType: string
    credentialBackedUp: boolean
    transports: string[] | null
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
      transports: (_.transports as AuthenticatorTransport[]) ?? undefined,
      credentialPublicKey: _.credentialPublicKey,
      credentialDeviceType: _.credentialDeviceType as CredentialDeviceType,
    })),
  }
}

class CouldNotSetChallenge extends Data.TaggedError(
  'CouldNotSetChallengeError'
) {}
