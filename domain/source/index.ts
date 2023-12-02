import { Option } from 'effect'

export { SourceRepository } from '@/domain/source/repository'
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
