import { Co2Repository } from '@/domain/co2'
import { db } from '@/infra/db'
import { co2Average } from '@/infra/db/schema'
import { eq } from 'drizzle-orm'
import { cache as reactCache } from 'react'

const isTest = process.env.NODE_ENV === 'test'
const cache = isTest ? (callback: any) => callback : reactCache

function makeCo2Repository(): Co2Repository {
  return {
    getAllCo2Averages: cache(async () => {
      const data = await db.select().from(co2Average)
      return data.map((co2Average) => ({
        ...co2Average,
        avgPerYear: Number(co2Average.avgPerYear ?? 1),
        avgPerUnit: co2Average.avgPerUnit ?? 1,
      }))
    }),
    getCo2AverageBySlug: cache(async (slug: string) => {
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
    }),
  }
}

const co2Repository = makeCo2Repository

export default co2Repository
