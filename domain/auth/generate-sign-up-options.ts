import { AuthError, PassKey } from '@/adapter/pass-key'
import { UserRepository } from '@/domain/user/repository'
import { Effect, Option } from 'effect'
import { AlreadyRegistered } from '../../app/(auth)/errors'

export function generateSignUpOptionsEffect(username: string) {
  return Effect.gen(function* ($) {
    const userRepo = yield* $(UserRepository)

    const existingUser = yield* $(userRepo.findByUsername(username))

    if (
      Option.isSome(existingUser) &&
      existingUser.value.authenticators.length > 0
    ) {
      yield* $(new AlreadyRegistered())
    }

    const user = Option.isSome(existingUser)
      ? existingUser.value
      : yield* $(userRepo.createUser(username))

    const passKeyService = yield* $(PassKey)
    const options = yield* $(
      passKeyService.generateRegistrationOptions({
        userId: user.id,
        userName: user.username,
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
