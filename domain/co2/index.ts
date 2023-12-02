import { DbLive } from '@/adapter/db'
import { Co2RepositoryLive } from '@/domain/co2/repository'
import { Layer, Option } from 'effect'

export { Co2Repository } from '@/domain/co2/repository'
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
  description: Option.Option<string>
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

export const co2RepoLive = Co2RepositoryLive.pipe(Layer.provide(DbLive))
