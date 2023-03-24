import repo from '@/adapter/source-repository'

export type Source = {
  id: string
  co2_producer_id: string
  region: string | null
  year: number | null
  g_co2e: number
  per: number
  description: string
  user_id: string
  name: string
}

export type SourceRepository = {
  getAllSourcesByCo2ProducerId: (id: string) => Promise<Source[]>
}

export const getAllSourcesByCo2ProducerId = repo.getAllSourcesByCo2ProducerId
