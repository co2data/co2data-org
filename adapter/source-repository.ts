// import { SourceRepository } from '@/domain/source'
import { Source } from '@/domain/source'
import { DB, DbError } from '@/infra/db'
import { links, sourcedCo2Amounts, sources } from '@/infra/db/schema'
import { eq, or } from 'drizzle-orm'
import { Context, Effect, Layer, Option, ReadonlyArray, pipe } from 'effect'
import { remark } from 'remark'
import html from 'remark-html'

export interface SourceRepository {
  getAllSourcesByCo2ProducerId: (
    id: string
  ) => Effect.Effect<never, MarkdownError | DbError, Source[]>
}

export const SourceRepository = Context.Tag<SourceRepository>()

export const SourceRepositoryLive = Layer.effect(
  SourceRepository,
  Effect.map(DB, (database) =>
    SourceRepository.of({
      getAllSourcesByCo2ProducerId: (id) =>
        Effect.gen(function* (_) {
          const data = yield* _(database.sources.getAllByProducerId(id))

          const transformedData = yield* _(
            pipe(
              data,
              ReadonlyArray.map((source) =>
                markdownToHtml(source.description).pipe(
                  Effect.map((markdown) => ({
                    ...source,
                    description: markdown,
                  }))
                )
              ),
              Effect.all
            )
          )
          return transformedData
        }),
    })
  )
)
export class MarkdownError extends Error {
  readonly _tag = 'MarkdownError'
}
function markdownToHtml(markdown: string) {
  return Effect.tryPromise({
    try: () => remark().use(html).process(markdown),
    catch: (cause) => new MarkdownError('Markdown Error', { cause }),
  }).pipe(Effect.map((source) => source.toString()))
}
