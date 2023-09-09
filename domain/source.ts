import { SourceRepositoryLive } from '@/adapter/source-repository'
import { DbLive } from '@/infra/db'
import { Effect, Layer, Option } from 'effect'
export { SourceRepository } from '@/adapter/source-repository'
export type Source = {
  id: string
  region: string | null
  year: number | null
  gCo2e: number
  per: number
  description: string
  userId: string
  name: string
  links: Option.Option<Link[]>
}

export type Link = {
  id: string
  mediaType: string
  name: string
  url: string
}

export const repository = SourceRepositoryLive.pipe(Layer.use(DbLive))
