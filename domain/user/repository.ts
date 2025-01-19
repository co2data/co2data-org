import { DB, DbError } from '@/adapter/db'
import * as schema from '@/adapter/db/schema'
import type { VerifiedRegistrationResponse } from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import type { CredentialDeviceType } from '@simplewebauthn/types'
import { eq } from 'drizzle-orm'
import { Effect, Layer, Option, Predicate } from 'effect'
import { Base64String, type User } from '.'

const make = Effect.gen(function* ($) {
  const database = yield* $(DB)

  return {
    createUser: (username: string) =>
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
    findByUsername: (username: string) =>
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

    setCurrentChallenge: (userId: string, currentChallenge: string) =>
      database
        .query((_) =>
          _.update(schema.users)
            .set({ currentChallenge })
            .where(eq(schema.users.id, userId)),
        )
        .pipe(Effect.withSpan('setCurrentChallenge')),
    addAuthenticator: (
      userId: string,
      registrationInfo: NonNullable<
        VerifiedRegistrationResponse['registrationInfo']
      >,
    ) =>
      database
        .query((_) => {
          const authenticator = {
            userId: userId,
            counter: registrationInfo.credential.counter as unknown as bigint,
            credentialBackedUp: registrationInfo.credentialBackedUp,
            credentialDeviceType: registrationInfo.credentialDeviceType,
            credentialId: registrationInfo.credential.id,
            // saving as varbinary/binary/blob gets me some strange base64 back that I don't know how to convert to Uint8Array back...
            // I'm converting it to base64 myself and handel conversion back myself
            credentialPublicKey: isoBase64URL.fromBuffer(
              registrationInfo.credential.publicKey,
            ),
          } satisfies typeof schema.authenticators.$inferInsert
          return _.insert(schema.authenticators).values(authenticator)
        })
        .pipe(Effect.withSpan('addAuthenticator')),
    updateCounter: (userId: string, counter: number) =>
      database
        .query((_) =>
          _.update(schema.authenticators)
            .set({ counter: counter as unknown as bigint })
            .where(eq(schema.authenticators.userId, userId)),
        )
        .pipe(Effect.withSpan('updateCounter')),
  }
})

export class UserRepository extends Effect.Tag('@services/UserRepository')<
  UserRepository,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make).pipe(Layer.provide(DB.Live))
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
      credentialID: Base64String(_.credentialId),
      ...(_.transports ? { transports: _.transports } : {}),
      credentialPublicKey: _.credentialPublicKey,
      credentialDeviceType: _.credentialDeviceType as CredentialDeviceType,
    })),
  }
}
