import { Co2RepositoryLive } from '@/adapter/co2-repository'
import { DbLive } from '@/infra/db'
import { Layer } from 'effect'
export { Co2Repository } from '@/adapter/co2-repository'
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

export const repositoryLive = Co2RepositoryLive.pipe(Layer.use(DbLive))
