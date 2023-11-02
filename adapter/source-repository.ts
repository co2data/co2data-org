// import { SourceRepository } from '@/domain/source'
import { Source } from '@/domain/source'
import { DB, DbError } from '@/infra/db'
import { Context, Effect, Layer, ReadonlyArray, pipe } from 'effect'
import { remark } from 'remark'
import html from 'remark-html'

export interface SourceRepository {
  getAllSourcesByCo2ProducerId: (
    id: string
  ) => Effect.Effect<never, DbError, Source[]>
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
            pipe(data, ReadonlyArray.map(transformDescriptionToHTML), (a) =>
              Effect.all(a, {
                concurrency: 'unbounded',
              })
            )
          )
          return transformedData
        }).pipe(
          Effect.tap((_) => Effect.logTrace(`id: ${id}`)),
          Effect.withSpan('getAllSourcesByCo2ProducerId')
        ),
    })
  )
)

function transformDescriptionToHTML(source: Source) {
  return Effect.promise(() =>
    remark().use(html).process(source.description)
  ).pipe(
    Effect.map((processed) => processed.toString()),
    Effect.map((markdown) => ({
      ...source,
      description: markdown,
    })),
    Effect.withSpan('transformDescriptionToHTML')
  )
}
