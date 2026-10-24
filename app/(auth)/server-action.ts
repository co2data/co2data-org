'use server'

import 'server-only'

import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/server'
import { Effect, flow, Option } from 'effect'
import { redirect } from 'next/navigation'
import { runServerAction, type ServerActionPayload } from '@/adapter/effect'
import { AuthError, PassKey } from '@/adapter/pass-key'
import { Session } from '@/adapter/session'
import { generateLoginOptionsEffect } from '@/domain/auth/generate-login-options'
import { generateSignUpOptionsEffect } from '@/domain/auth/generate-sign-up-options'
import { UserRepository } from '@/domain/user/repository'
import {
  CouldNotFindAuthenticator,
  NoChallengeOnUser,
  NotVerified,
  NoUserFound,
} from './errors'

export const generateLoginOptions = flow(
  generateLoginOptionsEffect,
  runServerAction('generateLoginOptions'),
)
export async function verifyLogin(
  body: AuthenticationResponseJSON & {
    username: string
  },
) {
  return Effect.gen(function* () {
    const userRepo = yield* UserRepository

    const maybeUser = yield* userRepo
      .findByUsername(body.username)
      .pipe(Effect.mapError(() => new NoUserFound()))
    if (Option.isNone(maybeUser)) {
      return yield* new NoUserFound()
    }
    const user = maybeUser.value

    if (Option.isNone(user.currentChallenge)) {
      return yield* new NoChallengeOnUser()
    }

    const authenticator = user.authenticators.find(
      (authenticator) => authenticator.credentialID === body.id,
    )

    if (!authenticator) {
      return yield* new CouldNotFindAuthenticator()
    }

    const verification = yield* PassKey.verifyAuthenticationResponse({
      body: body,
      expectedChallenge: user.currentChallenge.value,
      authenticator,
    })

    const { verified } = verification

    if (verified) {
      const { authenticationInfo } = verification
      yield* userRepo.updateCounter(user.id, authenticationInfo.newCounter)
      yield* Session.use((session) => session.setSession(user.username))
      return { verified }
    }
    return yield* new NotVerified()
  }).pipe(
    Effect.catchTags({
      DbError: (cause) => new AuthError({ cause }),
      CouldNotFindAuthenticatorError: (cause) => new AuthError({ cause }),
      NoChallengeOnUserError: (cause) => new AuthError({ cause }),
      NotVerifiedError: (cause) => new AuthError({ cause }),
    }),
    Effect.tapError((e) => Effect.log('Login Error', e.cause)),
    runServerAction('verifyLogin'),
  )
}

export const generateSignUpOptions = flow(
  generateSignUpOptionsEffect,
  runServerAction('generateSignUpOptions'),
)

export async function verifySignUp(
  body: RegistrationResponseJSON & { username: string },
) {
  return Effect.gen(function* () {
    const userRepo = yield* UserRepository
    const maybeUser = yield* userRepo
      .findByUsername(body.username)
      .pipe(Effect.mapError(() => new NoUserFound()))
    if (Option.isNone(maybeUser)) {
      return yield* new NoUserFound()
    }
    const user = maybeUser.value

    if (Option.isNone(user.currentChallenge)) {
      return yield* new NoChallengeOnUser()
    }

    const verification = yield* PassKey.verifyRegistrationResponse({
      responseBody: body,
      currentChallenge: user.currentChallenge.value,
    })

    const { verified, registrationInfo } = verification

    if (verified && registrationInfo) {
      yield* userRepo.addAuthenticator(user.id, registrationInfo)
      return { verified }
    }
    return yield* new NotVerified()
  })
    .pipe(
      Effect.catchTags({
        DbError: (cause) => new AuthError({ cause }),
        NoChallengeOnUserError: (cause) => new AuthError({ cause }),
        NoUserFoundError: (cause) => new AuthError({ cause }),
        UnknownError: (cause) => new AuthError({ cause }),
        NotVerifiedError: (cause) => new AuthError({ cause }),
      }),
      runServerAction('verifySignUp'),
    )
    .then(redirectRight('/sign-up-success', (_) => _.verified))
}

function redirectRight<A, E>(
  to: string,
  predicate?: (p: A) => boolean,
): (
  result: ServerActionPayload<A, E>,
) => Promise<never> | ServerActionPayload<A, E> {
  return (result) => {
    if (result._tag === 'Success' && (!predicate || predicate(result.value))) {
      return redirect(to)
    }
    return result
  }
}
