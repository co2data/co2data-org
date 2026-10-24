import { Context, Effect, Layer } from 'effect'
import { marked } from 'marked'
import { DB, type DbError } from '@/adapter/db'
import type { Source } from '@/domain/source'

interface _SourceRepository {
  getAllSourcesByCo2ProducerId: (id: string) => Effect.Effect<Source[], DbError>
}

const make = Effect.gen(function* () {
  const database = yield* DB

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

export class SourceRepository extends Context.Service<
  SourceRepository,
  _SourceRepository
>()('@services/SourceRepository') {
  static Live = Layer.effect(this, make)
}

export const getAllSourcesByCo2ProducerId = (id: string) =>
  SourceRepository.use((repo) => repo.getAllSourcesByCo2ProducerId(id))

function transformMarkdownToHTML(source: Source) {
  return Effect.promise(() => marked(source.description, { async: true })).pipe(
    Effect.map((html) => ({
      ...source,
      description: html,
    })),
    Effect.withSpan('transformDescriptionToHTML'),
  )
}
