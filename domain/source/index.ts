import { getSession } from '@/adapter/session'
import { Effect, Option } from 'effect'
import { authorize, writeOwn } from '../user'

import { SelectSourcedCo2Amounts } from '@/adapter/db/schema'
import { SourceRepository } from '@/domain/source/repository'
export { SourceRepository }
export type Source = {
  id: string
  region: string | null
  year: number | null
  gCo2e: number
  per: number
  description: string
  userId: string
  name: string
  links: Option.Option<Link[]>
}

export type Link = {
  id: string
  mediaType: string
  name: string
  url: string
}

export const edit = (source: SelectSourcedCo2Amounts) =>
  Effect.gen(function* ($) {
    const user = yield* $(
      getSession(),
      Effect.flatMap((user) =>
        authorize({ user, permission: writeOwn, recordUserId: source.userId }),
      ),
    )
    const sourceRepo = yield* $(SourceRepository)
    return yield* $(sourceRepo.editOwn(source, user))
  }).pipe(Effect.withSpan('edit'))
