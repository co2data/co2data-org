import { cache } from 'react'
import { SourceRepository } from '@/domain/source'
import { db } from '@/infra/db'
import { remark } from 'remark'
import html from 'remark-html'

export function makeSourceRepository(deps = { db }): SourceRepository {
  return {
    getAllSourcesByCo2ProducerId: cache(async (id: string) => {
      const data = await deps.db
        .selectFrom('sources')
        .selectAll()
        .where('co2_producer_id', '=', id)
        .execute()
      const mappedData = data.map(async (source) => ({
        ...source,
        description: await markdownToHtml(source.description),
      }))
      return Promise.all(mappedData)
    }),
  }
}

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown)
  return result.toString()
}

export default makeSourceRepository()
