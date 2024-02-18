import { DB, DbError } from '@/adapter/db'
import { Source } from '@/domain/source'
import { Context, Effect, Layer } from 'effect'
import { remark } from 'remark'
import html from 'remark-html'

export interface SourceRepository {
  getAllSourcesByCo2ProducerId: (id: string) => Effect.Effect<Source[], DbError>
}

export const SourceRepository = Context.GenericTag<SourceRepository>(
  '@services/SourceRepository',
)

const make = Effect.gen(function* ($) {
  const database = yield* $(DB)

  return SourceRepository.of({
    getAllSourcesByCo2ProducerId: (id) =>
      database.sources.getAllByProducerId(id).pipe(
        Effect.flatMap(
          Effect.forEach(transformMarkdownToHTML, { concurrency: 5 }),
        ),
        Effect.tap((_) => Effect.logTrace(`id: ${id}`)),
        Effect.withSpan('getAllSourcesByCo2ProducerId'),
      ),
  })
})

export const SourceRepositoryLive = Layer.effect(SourceRepository, make)

function transformMarkdownToHTML(source: Source) {
  return Effect.promise(() =>
    remark().use(html).process(source.description),
  ).pipe(
    Effect.map((processed) => processed.toString()),
    Effect.map((markdown) => ({
      ...source,
      description: markdown,
    })),
    Effect.withSpan('transformDescriptionToHTML'),
  )
}
