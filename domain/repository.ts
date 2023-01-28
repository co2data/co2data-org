import { select } from '@/infra/db'

export type Co2Average = {
  title: string
  slug: string
  unit: string
  avg_per_year: number
  avg_per_unit: number
}

const mkGetAllCo2Averages =
  (deps = { select }) =>
  async () =>
    await deps.select<Co2Average>('select * from co2_average')

const mkGetCo2AverageBySlug =
  (deps = { select }) =>
  async (slug: string) => {
    const [row] = await deps.select<Co2Average>(
      'select * from co2_average WHERE `slug` = ?',
      [slug]
    )
    return row
  }

export const getAllCo2Averages = mkGetAllCo2Averages({ select })
export const getCo2AverageBySlug = mkGetCo2AverageBySlug({ select })
