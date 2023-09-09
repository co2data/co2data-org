// import { SourceRepository } from '@/domain/source'
import { Source } from '@/domain/source'
import { DB } from '@/infra/db'
import { links, sourcedCo2Amounts, sources } from '@/infra/db/schema'
import { eq, or } from 'drizzle-orm'
import { Context, Effect, Layer, Option, ReadonlyArray, pipe } from 'effect'
import { remark } from 'remark'
import html from 'remark-html'

export interface SourceRepository {
  getAllSourcesByCo2ProducerId: (
    id: string
  ) => Effect.Effect<never, unknown, Source[]>
}

export const SourceRepository = Context.Tag<SourceRepository>()

export const SourceRepositoryLive = Layer.effect(
  SourceRepository,
  Effect.map(DB, (database) =>
    SourceRepository.of({
      getAllSourcesByCo2ProducerId: (id) =>
        Effect.gen(function* (_) {
          const db = yield* _(database)
          const amountSources = yield* _(
            Effect.tryPromise(() =>
              db
                .select({
                  id: sourcedCo2Amounts.id,
                  gCo2e: sourcedCo2Amounts.gCo2E,
                  per: sourcedCo2Amounts.per,
                  quote: sourcedCo2Amounts.quote,
                  description: sourcedCo2Amounts.description,
                  userId: sourcedCo2Amounts.userId,
                  name: sources.name,
                  year: sources.year,
                  region: sources.region,
                  sourcesId: sources.id,
                })
                .from(sourcedCo2Amounts)
                .innerJoin(sources, eq(sourcedCo2Amounts.sourceId, sources.id))
                .where(eq(sourcedCo2Amounts.co2ProducerId, id))
            )
          )
          const linksResult = yield* _(
            Effect.tryPromise(() =>
              db
                .select()
                .from(links)
                .where(
                  or(
                    ...amountSources.map((i) =>
                      eq(links.sourcesId, i.sourcesId)
                    )
                  )
                )
            )
          )

          const sourcesWithLinks = amountSources.map((source) => {
            const links = pipe(
              linksResult,
              ReadonlyArray.filter(
                (link) => link.sourcesId === source.sourcesId
              ),
              Option.some,
              Option.filter((a) => a.length > 0)
            )
            return { ...source, links }
          })

          const sourceLinksWithDescriptions = yield* _(
            Effect.all(
              sourcesWithLinks.map((sWL) =>
                pipe(
                  Effect.tryPromise(() => markdownToHtml(sWL.description)),
                  Effect.map((description) => ({ ...sWL, description }))
                )
              )
            )
          )

          return sourceLinksWithDescriptions
        }),
    })
  )
)

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
