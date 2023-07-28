import { Co2Repository } from '@/domain/co2'
import { db } from '@/infra/db'
import { co2Average } from '@/infra/db/schema'
import { desc, eq } from 'drizzle-orm'

function makeCo2Repository(): Co2Repository {
  return {
    getAllCo2Averages: async () => {
      const data = await db
        .select()
        .from(co2Average)
        .orderBy(desc(co2Average.avgPerYear))
      return data.map((co2Average) => ({
        ...co2Average,
        avgPerYear: Number(co2Average.avgPerYear ?? 1),
        avgPerUnit: co2Average.avgPerUnit ?? 1,
      }))
    },
    getCo2AverageBySlug: async (slug: string) => {
      const [first] = await db
        .select()
        .from(co2Average)
        .where(eq(co2Average.slug, slug))
      if (first === undefined) return undefined
      return {
        ...first,
        avgPerYear: Number(first.avgPerYear ?? 1),
        avgPerUnit: first.avgPerUnit ?? 1,
      }
    },
  }
}

const co2Repository = makeCo2Repository

export default co2Repository
