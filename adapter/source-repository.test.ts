import { Effect, Layer } from 'effect'
import { SourceRepository, SourceRepositoryLive } from './source-repository'
import { DB, DbError } from '@/infra/db'
import { mock } from 'testtriple'
import { Source } from '@/domain/source'
import { describe, expect, it } from 'vitest'
import { makeSource } from '@/domain/source/example-data'

describe('source repository', () => {
  describe('getAllByProducerId', () => {
    it('takes happy path', async () => {
      const actual = await runWithTestDb(
        (repo) => repo.getAllSourcesByCo2ProducerId('1'),
        makeSource()
      )

      expect(actual).toStrictEqual([
        {
          description: '<p>No description</p>\n',
          gCo2e: 2000,
          id: '1',
          links: {
            value: [
              {
                id: 'id1',
                mediaType: 'xls',
                name: 'Excel sheet',
                url: 'https://some-server.domain/route.xls',
              },
            ],
          },
          name: 'Sustainability Report 2018',
          per: 1,
          region: 'World',
          userId: 'user1',
          year: 2018,
        },
      ])
    })

    it('transforms markdown to html in description', async () => {
      const actual = await runWithTestDb(
        (repo) => repo.getAllSourcesByCo2ProducerId('1'),
        makeSource({
          description: 'Some **bold** text with a [link](https://link.to)',
        })
      )

      expect(actual).toStrictEqual([
        {
          description:
            '<p>Some <strong>bold</strong> text with a <a href="https://link.to">link</a></p>\n',
          gCo2e: 2000,
          id: '1',
          links: {
            value: [
              {
                id: 'id1',
                mediaType: 'xls',
                name: 'Excel sheet',
                url: 'https://some-server.domain/route.xls',
              },
            ],
          },
          name: 'Sustainability Report 2018',
          per: 1,
          region: 'World',
          userId: 'user1',
          year: 2018,
        },
      ])
    })
  })
})

function runWithTestDb(
  f: (repo: SourceRepository) => Effect.Effect<never, DbError, any>,
  mockData: Source
) {
  const DbTest = Layer.succeed(
    DB,
    DB.of(
      mock({
        sources: {
          getAllByProducerId: () => Effect.succeed([mockData]),
        },
      })
    )
  )

  const SourceRepoTest = SourceRepositoryLive.pipe(Layer.provide(DbTest))

  const getAllCo2Averages = SourceRepository.pipe(
    Effect.flatMap(f),
    Effect.provide(SourceRepoTest),
    Effect.runPromise
  )
  return getAllCo2Averages
}
