import { BaseError } from '@/lib/types'
import { Data } from 'effect'

export class NoValueEntered extends Data.TaggedError('NoValueEnteredError') {}
export class SystemFailure extends Data.TaggedError(
  'SystemFailureError',
)<BaseError> {}
