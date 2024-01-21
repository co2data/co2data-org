'use server'

import { mainLive } from '@/adapter/effect/main'
import { PassKey } from '@/adapter/pass-key'
import { NodeSdkLive } from '@/adapter/tracing/NodeSdkLive'
import { UserRepository } from '@/domain/user/repository'
import { Effect, Option } from 'effect'
import {
  CouldNotFindAuthenticator,
  NoChallengeOnUser,
  NoUserFound,
  NotVerified,
} from './errors'

export async function generateLoginOptions(username: string) {
  const result = await Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByEmail(username),
      Effect.filterOrFail(Option.isSome, () => new NoUserFound()),
      Effect.map((_) => _.value)
    )
    const passKeyService = yield* $(PassKey)
    const options = yield* $(
      passKeyService.generateAuthenticationOptions({
        userAuthenticators: user.authenticators,
      })
    )

    yield* $(userRepo.setCurrentChallenge(user.id, options.challenge))
    return options
  }).pipe(
    Effect.withSpan('generateLoginOptions'),
    Effect.either,
    Effect.provide(mainLive),
    Effect.provide(NodeSdkLive),
    Effect.runPromise
  )

  return result.toJSON() as unknown as typeof result
}

export async function verifyLogin(body: {
  id: string
  rawId: string
  response: any
  clientExtensionResults: any
  type: any
  username: string
}) {
  const result = await Effect.gen(function* ($) {
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
  }).pipe(
    Effect.withSpan('verifyLogin'),
    Effect.either,
    Effect.provide(mainLive),
    Effect.provide(NodeSdkLive),
    Effect.runPromise
  )

  return result.toJSON() as unknown as typeof result
}

export async function generateSignUpOptions() {
  const result = await Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)

    const user = yield* $(
      userRepo.findByEmail('phi.sch@hotmail.ch'),
      Effect.filterOrFail(Option.isSome, () => new NoUserFound()),
      Effect.map((_) => _.value)
    )

    const passKeyService = yield* $(PassKey)
    const options = yield* $(
      passKeyService.generateRegistrationOptions({
        userId: user.id,
        userName: user.email,
      })
    )
    yield* $(userRepo.setCurrentChallenge(user.id, options.challenge))
    return options
  }).pipe(
    Effect.withSpan('generateSignUpOptions'),
    Effect.either,
    Effect.provide(mainLive),
    Effect.provide(NodeSdkLive),
    Effect.runPromise
  )

  return result.toJSON() as unknown as typeof result
}

export async function verifySignUp(body: any) {
  const result = await Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByEmail('phi.sch@hotmail.ch'),
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
  }).pipe(
    Effect.withSpan('verifySignUp'),
    Effect.either,
    Effect.provide(mainLive),
    Effect.provide(NodeSdkLive),
    Effect.runPromise
  )
  return result.toJSON() as unknown as typeof result
}
