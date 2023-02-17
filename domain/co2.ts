import makeCo2Repository from '@/adapter/co2-repository'

export type Co2Average = {
  id: string
  title: string
  slug: string
  unit:
    | 'gram'
    | 'hour'
    | 'kilogram'
    | 'kilometer'
    | 'liter'
    | 'meter'
    | 'minute'
  avg_per_year: number
  avg_per_unit: number
}

export type Co2Repository = {
  getAllCo2Averages: () => Promise<Co2Average[]>
  getCo2AverageBySlug: (slug: string) => Promise<Co2Average | undefined>
}

const repository = makeCo2Repository()

export const getAllCo2Averages = repository.getAllCo2Averages
export const getCo2AverageBySlug = repository.getCo2AverageBySlug
