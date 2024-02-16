import { Data } from 'effect'

export class NoUserFound extends Data.TaggedError('NoUserFoundError') {}
export class NoChallengeOnUser extends Data.TaggedError(
  'NoChallengeOnUserError',
) {}
export class NotVerified extends Data.TaggedError('NotVerifiedError') {}
export class CouldNotFindAuthenticator extends Data.TaggedError(
  'CouldNotFindAuthenticatorError',
) {}

export class StartAuthenticationFailed extends Data.TaggedError(
  'StartAuthenticationFailedError',
) {}

export class MissingUserName extends Data.TaggedError('MissingUserNameError') {}

export class AlreadyRegistered extends Data.TaggedError(
  'AlreadyRegisteredError',
) {}
