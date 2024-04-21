import { AuthError, PassKey } from '@/adapter/pass-key'
import { UserRepository } from '@/domain/user/repository'
import { Effect } from 'effect'
import { NoUserFound } from '../../app/(auth)/errors'

export function generateLoginOptionsEffect(username: string) {
  return Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)
    const user = yield* $(
      userRepo.findByUsername(username),
      Effect.flatMap(Effect.mapError(() => new NoUserFound())),
    )

    const options = yield* $(
      PassKey.generateAuthenticationOptions({
        userAuthenticators: user.authenticators,
      }),
    )

    yield* $(userRepo.setCurrentChallenge(user.id, options.challenge))
    return options
  }).pipe(
    Effect.catchTags({
      DbError: (cause) => new AuthError({ cause }),
    }),
  )
}
