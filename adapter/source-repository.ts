import { SourceRepository } from '@/domain/source'
import { db } from '@/infra/db'
import { links, sourcedCo2Amounts, sources } from '@/migrations/schema'
import { eq, or } from 'drizzle-orm/expressions'
import { cache } from 'react'
import { remark } from 'remark'
import html from 'remark-html'

export function makeSourceRepository(deps = { db }): SourceRepository {
  return {
    getAllSourcesByCo2ProducerId: cache(async (id: string) => {
      const amountSources = await deps.db
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

      const linksResult = await deps.db
        .select()
        .from(links)
        .where(
          or(...amountSources.map((i) => eq(links.sourcesId, i.sourcesId)))
        )

      const mappedData = amountSources.map(async (source) => {
        const linksOfSource = linksResult.filter(
          (link) => link.sourcesId === source.sourcesId
        )

        return {
          ...source,
          description: await markdownToHtml(source.description),
          links: linksOfSource.length > 0 ? linksOfSource : null,
        }
      })
      return Promise.all(mappedData)
    }),
  }
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

export default makeSourceRepository()
