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
  avgPerYear: number
  avgPerUnit: number
  singleConsumptionFrom: number
  singleConsumptionTo: number
  singleConsumptionAverage: number
  timesPerYearFrom: number
  timesPerYearTo: number
  timesPerYearAverage: number
}

export type Co2Repository = {
  getAllCo2Averages: () => Promise<Co2Average[]>
  getCo2AverageBySlug: (slug: string) => Promise<Co2Average | undefined>
}

export const repository = makeRepository
