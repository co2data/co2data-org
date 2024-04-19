import { Option } from 'effect'
import type { Source } from '.'

export function makeSource(override: Partial<Source> = {}) {
  return {
    id: '1',
    name: 'Sustainability Report 2018',
    description: 'No description',
    gCo2e: 2000,
    per: 1,
    year: 2018,
    userId: 'user1',
    links: Option.some([
      {
        id: 'id1',
        name: 'Excel sheet',
        mediaType: 'xls',
        url: 'https://some-server.domain/route.xls',
      },
    ]),
    region: 'World',
    ...override,
  } satisfies Source
}
