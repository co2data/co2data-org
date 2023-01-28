import { db } from '@/infra/db'
import { DB } from '@/infra/db/types'

export type Co2Average = DB['co2_average']

const mkGetAllCo2Averages =
  (deps = { db }) =>
  async () =>
    await deps.db.selectFrom('co2_average').selectAll().execute()

const mkGetCo2AverageBySlug =
  (deps = { db }) =>
  async (slug: string) =>
    deps.db
      .selectFrom('co2_average')
      .selectAll()
      .where('slug', '=', slug)
      .executeTakeFirst()

export const getAllCo2Averages = mkGetAllCo2Averages({ db })
export const getCo2AverageBySlug = mkGetCo2AverageBySlug({ db })
