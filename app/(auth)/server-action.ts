'use server'

import { runServerAction } from '@/adapter/effect'
import { AuthError, PassKey } from '@/adapter/pass-key'
import { setSession } from '@/adapter/session'
import { generateLoginOptionsEffect } from '@/domain/auth/generate-login-options'
import { generateSignUpOptionsEffect } from '@/domain/auth/generate-sign-up-options'
import { UserRepository } from '@/domain/user/repository'
import {
  AuthenticatorAssertionResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'
import { Effect, Either, Option, flow } from 'effect'
import { redirect } from 'next/navigation'
import {
  CouldNotFindAuthenticator,
  NoChallengeOnUser,
  NoUserFound,
  NotVerified,
} from './errors'

export const generateLoginOptions = flow(
  generateLoginOptionsEffect,
  runServerAction('generateLoginOptions'),
)
export async function verifyLogin(body: {
  id: string
  rawId: string
  response: AuthenticatorAssertionResponseJSON
  clientExtensionResults: AuthenticationExtensionsClientOutputs
  type: 'public-key'
  username: string
}) {
  return Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByUsername(body.username),
      Effect.filterOrFail(Option.isSome, () => new NoUserFound()),
      Effect.map((_) => _.value),
    )

    if (Option.isNone(user.currentChallenge)) {
      return yield* $(new NoChallengeOnUser())
    }

    const authenticator = user.authenticators.find(
      (authenticator) => authenticator.credentialID === body.id,
    )

    if (!authenticator) {
      return yield* $(new CouldNotFindAuthenticator())
    }

    const passKeyService = yield* $(PassKey)
    const verification = yield* $(
      passKeyService.verifyAuthenticationResponse({
        body: body,
        expectedChallenge: user.currentChallenge.value,
        authenticator,
      }),
    )

    const { verified } = verification

    if (verified) {
      const { authenticationInfo } = verification
      yield* $(userRepo.updateCounter(user.id, authenticationInfo.newCounter))
      yield* $(setSession(user.username))
      return { verified }
    }
    return yield* $(new NotVerified())
  }).pipe(
    Effect.catchTags({
      DbError: (cause) => new AuthError({ cause }),
      CouldNotFindAuthenticatorError: (cause) => new AuthError({ cause }),
      NoChallengeOnUserError: (cause) => new AuthError({ cause }),
      NotVerifiedError: (cause) => new AuthError({ cause }),
    }),
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
  return Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByUsername(body.username),
      Effect.filterOrFail(Option.isSome, () => new NoUserFound()),
      Effect.map((_) => _.value),
    )

    if (Option.isNone(user.currentChallenge)) {
      return yield* $(new NoChallengeOnUser())
    }

    const passKeyService = yield* $(PassKey)
    const verification = yield* $(
      passKeyService.verifyRegistrationResponse({
        responseBody: body,
        currentChallenge: user.currentChallenge.value,
      }),
    )

    const { verified, registrationInfo } = verification

    if (verified && registrationInfo) {
      yield* $(userRepo.addAuthenticator(user.id, registrationInfo))
      return { verified }
    }
    return yield* $(new NotVerified())
  }).pipe(
    Effect.catchTags({
      DbError: (cause) => new AuthError({ cause }),
      NoChallengeOnUserError: (cause) => new AuthError({ cause }),
      NoUserFoundError: (cause) => new AuthError({ cause }),
      UnknownException: (cause) => new AuthError({ cause }),
      NotVerifiedError: (cause) => new AuthError({ cause }),
    }),
    runServerAction('verifySignUp'),
    then(redirectRight('/sign-up-success', (_) => _.verified)),
  )
}

function then<T, U>(a: (c: T) => U) {
  return (p: Promise<T>) => p.then(a)
}

function redirectRight<E, T>(to: string, predicate?: (p: T) => boolean) {
  return (result: Either.Either<E, T>) => {
    if (Either.isRight(result) && predicate ? predicate(result.right) : true) {
      return redirect(to)
    }
    return result
  }
}
