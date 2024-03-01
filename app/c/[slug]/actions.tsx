'use server'

import { SelectSourcedCo2Amounts } from '@/adapter/db/schema'
import { runServerAction } from '@/adapter/effect'
import { Source } from '@/domain/index'
import { SourceRepository } from '@/domain/user'
import { Effect, Either, Predicate, flow } from 'effect'
import { revalidatePath } from 'next/cache'
import { NoValueEntered, SystemFailure } from './errors'

export const editSource = flow(
  getDataFromForm,
  Effect.andThen(Source.edit),
  runServerAction('edit source'),
  then(revalidate),
)

function then<T, U>(a: (c: T) => U) {
  return (p: Promise<T>) => p.then(a)
}

function revalidate(result: Either.Either<unknown, unknown>) {
  if (Either.isRight(result)) {
    return revalidatePath('/c/test', 'page')
  }
  console.log('left:', result.left)
  return result
}

function getDataFromForm(formData: FormData) {
  return Effect.gen(function* ($) {
    const gCo2e = formData.get('gCo2e') as string
    const id = formData.get('id') as string
    if (!gCo2e) {
      return yield* $(new NoValueEntered())
    }
    if (!id) {
      return yield* $(
        new SystemFailure({ cause: 'Did not get source Id from form.' }),
      )
    }
    const sourceRepo = yield* $(SourceRepository)
    const currentSource = yield* $(
      sourceRepo.findById(id),
      Effect.filterOrFail(
        Predicate.isNotUndefined,
        () =>
          new SystemFailure({
            cause: `Could not find SourcedCo2 with id ${id}.`,
          }),
      ),
    )

    return {
      id: id,
      gCo2E: Number(gCo2e),
      userId: currentSource.userId,
    } satisfies Partial<SelectSourcedCo2Amounts>
  }).pipe(
    Effect.withSpan('fromForm', {
      attributes: { formData: Object.fromEntries(formData) },
    }),
  )
}
