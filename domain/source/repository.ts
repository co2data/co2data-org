import { DB } from '@/adapter/db'
import { SelectSourcedCo2Amounts, sourcedCo2Amounts } from '@/adapter/db/schema'
import { Source } from '@/domain/source'
import { eq } from 'drizzle-orm'
import { Context, Effect, Layer } from 'effect'
import { remark } from 'remark'
import html from 'remark-html'
import { AuthorizedUser, WriteOwn } from '../user'

const make = Effect.gen(function* ($) {
  const database = yield* $(DB)

  return {
    getAllSourcesByCo2ProducerId: (id: string) =>
      database.sources.getAllByProducerId(id).pipe(
        Effect.flatMap(
          Effect.forEach(transformMarkdownToHTML, { concurrency: 5 }),
        ),
        Effect.tap((_) => Effect.logTrace(`id: ${id}`)),
        Effect.withSpan('getAllSourcesByCo2ProducerId'),
      ),
    findById: (id: string) =>
      database.query((_) =>
        _.query.sourcedCo2Amounts.findFirst({
          where: eq(sourcedCo2Amounts.id, id),
        }),
      ),
    editOwn: (
      source: SelectSourcedCo2Amounts,
      user: AuthorizedUser<WriteOwn>,
    ) => database.query((_) => _.update(sourcedCo2Amounts).set(source)),
  }
})

export class SourceRepository extends Context.Tag('@services/SourceRepository')<
  SourceRepository,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make)
}

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
