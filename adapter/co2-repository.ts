import { Co2Repository } from '@/domain/co2'
import { db } from '@/infra/db'

function makeCo2Repository(deps = { db }): Co2Repository {
  return {
    getAllCo2Averages: async () => {
      const data = await deps.db.selectFrom('co2_average').selectAll().execute()
      return data.map((co2Average) => ({
        ...co2Average,
        avg_per_year: Number(co2Average.avg_per_year ?? 1),
        avg_per_unit: co2Average.avg_per_unit ?? 1,
      }))
    },
    getCo2AverageBySlug: async (slug: string) => {
      const data = await deps.db
        .selectFrom('co2_average')
        .selectAll()
        .where('slug', '=', slug)
        .executeTakeFirst()
      if (data === undefined) return undefined
      return {
        ...data,
        avg_per_year: Number(data.avg_per_year ?? 1),
        avg_per_unit: data.avg_per_unit ?? 1,
      }
    },
  }
}

export default makeCo2Repository
