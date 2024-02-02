import { PassKey } from '@/adapter/pass-key'
import { UserRepository } from '@/domain/user/repository'
import { Effect, Option } from 'effect'
import { NoUserFound } from '../../app/auth/errors'

export function generateLoginOptionsEffect(username: string) {
  return Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByUsername(username),
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
  })
}
