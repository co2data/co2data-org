import { cache } from 'react'
import { SourceRepository } from '@/domain/source'
import { db } from '@/infra/db'
import { remark } from 'remark'
import html from 'remark-html'

export function makeSourceRepository(deps = { db }): SourceRepository {
  return {
    getAllSourcesByCo2ProducerId: cache(async (id: string) => {
      const amountSources = await deps.db
        .selectFrom('sourced_co2_amounts as amount')
        .innerJoin('sources', 'sources.id', 'amount.source_id')
        .select([
          'amount.id',
          'amount.g_co2e',
          'amount.per',
          'amount.quote',
          'amount.description',
          'amount.user_id',
          'sources.name',
          'sources.year',
          'sources.region',
          'sources.id as source_id',
        ])
        .where('amount.co2_producer_id', '=', id)
        .execute()

      const links = await deps.db
        .selectFrom('links')
        .selectAll()
        .where(
          'links.sources_id',
          'in',
          amountSources.map((i) => i.source_id)
        )
        .execute()
      const mappedData = amountSources.map(async (source) => {
        const linksOfSource = links
          .filter((link) => link.sources_id === source.source_id)
          .map((link) => ({
            ...link,
            mediaType: link.media_type,
          }))

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
