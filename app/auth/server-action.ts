'use server'

import { runServerAction } from '@/adapter/effect'
import { PassKey } from '@/adapter/pass-key'
import { generateLoginOptionsEffect } from '@/domain/auth/generate-login-options'
import { generateSignUpOptionsEffect } from '@/domain/auth/generate-sign-up-options'
import { UserRepository } from '@/domain/user/repository'
import { RegistrationResponseJSON } from '@simplewebauthn/types'
import { Effect, Option, flow } from 'effect'
import {
  CouldNotFindAuthenticator,
  NoChallengeOnUser,
  NoUserFound,
  NotVerified,
} from './errors'

export const generateLoginOptions = flow(
  generateLoginOptionsEffect,
  runServerAction('generateLoginOptions')
)
export async function verifyLogin(body: {
  id: string
  rawId: string
  response: any
  clientExtensionResults: any
  type: any
  username: string
}) {
  return Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByEmail(body.username),
      Effect.filterOrFail(Option.isSome, () => new NoUserFound()),
      Effect.map((_) => _.value)
    )

    if (Option.isNone(user.currentChallenge)) {
      return yield* $(new NoChallengeOnUser())
    }

    const authenticator = user.authenticators.find(
      (authenticator) => authenticator.credentialID === body.id
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
      })
    )

    const { verified } = verification

    if (verified) {
      const { authenticationInfo } = verification
      yield* $(userRepo.updateCounter(user.id, authenticationInfo.newCounter))
      return { verified }
    } else {
      return yield* $(new NotVerified())
    }
  }).pipe(runServerAction('verifyLogin'))
}

export const generateSignUpOptions = flow(
  generateSignUpOptionsEffect,
  runServerAction('generateSignUpOptions')
)

export async function verifySignUp(
  body: RegistrationResponseJSON & { username: string }
) {
  return Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByEmail(body.username),
      Effect.filterOrFail(Option.isSome, () => new NoUserFound()),
      Effect.map((_) => _.value)
    )

    if (Option.isNone(user.currentChallenge)) {
      return yield* $(new NoChallengeOnUser())
    }

    const passKeyService = yield* $(PassKey)
    const verification = yield* $(
      passKeyService.verifyRegistrationResponse({
        responseBody: body,
        currentChallenge: user.currentChallenge.value,
      })
    )

    const { verified, registrationInfo } = verification

    if (verified && registrationInfo) {
      yield* $(userRepo.addAuthenticator(user.id, registrationInfo))
      return { verified }
    } else {
      return yield* $(new NotVerified())
    }
  }).pipe(runServerAction('verifySignUp'))
}
