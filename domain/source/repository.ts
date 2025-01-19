import { DB } from '@/adapter/db'
import type { Source } from '@/domain/source'
import { Effect, Layer } from 'effect'
import { marked } from 'marked'

interface _SourceRepository {
  getAllSourcesByCo2ProducerId: (id: string) => Effect.Effect<Source[], DbError>
}

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

export class SourceRepository extends Effect.Tag('@services/SourceRepository')<
  SourceRepository,
  _SourceRepository
>() {
  static Live = Layer.effect(this, make)
}

function transformMarkdownToHTML(source: Source) {
  return Effect.promise(() => marked(source.description, { async: true })).pipe(
    Effect.map((html) => ({
      ...source,
      description: html,
    })),
    Effect.withSpan('transformDescriptionToHTML'),
  )
}
