import { Option } from 'effect'
import type { Source } from '@/domain/source'

type QueryResult = {
  id: string
  gCo2e: number
  per: number
  quote: string | null
  description: string
  userId: string
  name: string
  year: number | null
  region: string | null
  sourcesId: string
  links: {
    id: string
    name: string
    sourcesId: string
    mediaType: string
    url: string
  } | null
}

export function combineLinks(d: QueryResult[]) {
  return d.reduce<Source[]>((acc, source) => {
    const existing = acc.find((e) => e.id === source.id)
    if (existing) {
      return [
        ...acc.filter((e) => e.id !== source.id),
        {
          ...existing,
          links: Option.map(existing.links, (links) =>
            source.links ? [...links, source.links] : links,
          ).pipe(
            Option.orElse(() =>
              Option.fromNullOr(source.links).pipe(
                Option.map((link) => [link]),
              ),
            ),
          ),
        },
      ]
    }
    acc.push({
      ...source,
      region: Option.fromNullOr(source.region),
      year: Option.fromNullOr(source.year),
      links: Option.fromNullOr(source.links).pipe(Option.map((link) => [link])),
    })
    return acc
  }, [])
}
