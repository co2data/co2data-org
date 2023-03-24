import makeRepository from '@/adapter/co2-repository'

export type Unit =
  | 'gram'
  | 'hour'
  | 'kilogram'
  | 'kilometer'
  | 'liter'
  | 'meter'
  | 'minute'

export type Co2Average = {
  id: string
  title: string
  slug: string
  unit: Unit
  avg_per_year: number
  avg_per_unit: number
  single_consumption_from: number
  single_consumption_to: number
  single_consumption_average: number
  times_per_year_from: number
  times_per_year_to: number
  times_per_year_average: number
}

export type Co2Repository = {
  getAllCo2Averages: () => Promise<Co2Average[]>
  getCo2AverageBySlug: (slug: string) => Promise<Co2Average | undefined>
}

export const repository = makeRepository
