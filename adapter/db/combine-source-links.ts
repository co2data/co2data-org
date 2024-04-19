import type { Source } from '@/domain/source'
import { Option, ReadonlyArray } from 'effect'

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
          links: Option.map(
            existing.links,
            ReadonlyArray.appendAll(ReadonlyArray.fromNullable(source.links)),
          ).pipe(
            Option.orElse(() =>
              Option.fromNullable(source.links).pipe(
                Option.map(ReadonlyArray.of),
              ),
            ),
          ),
        },
      ]
    }
    acc.push({
      ...source,
      links: Option.fromNullable(source.links).pipe(
        Option.map(ReadonlyArray.of),
      ),
    })
    return acc
  }, [])
}
