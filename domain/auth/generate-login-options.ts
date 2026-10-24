import { Effect, Option } from 'effect'
import { AuthError, PassKey } from '@/adapter/pass-key'
import { UserRepository } from '@/domain/user/repository'
import { NoUserFound } from '../../app/(auth)/errors'

export function generateLoginOptionsEffect(username: string) {
  return Effect.gen(function* () {
    const userRepo = yield* UserRepository
    const maybeUser = yield* userRepo
      .findByUsername(username)
      .pipe(Effect.mapError(() => new NoUserFound()))
    if (Option.isNone(maybeUser)) {
      return yield* new NoUserFound()
    }
    const user = maybeUser.value

    const options = yield* PassKey.generateAuthenticationOptions({
      userAuthenticators: user.authenticators,
    })

    yield* userRepo.setCurrentChallenge(user.id, options.challenge)
    return options
  }).pipe(
    Effect.catchTags({
      DbError: (cause) => new AuthError({ cause }),
    }),
  )
}
