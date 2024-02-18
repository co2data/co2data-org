import { DB, DbError } from '@/adapter/db'
import { Source } from '@/domain/source'
import { makeSource } from '@/domain/source/example-data'
import { Effect, Layer } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, it } from 'vitest'
import { SourceRepository } from './repository'

describe('source repository', () => {
  describe('getAllByProducerId', () => {
    it('takes happy path', () =>
      Effect.gen(function* ($) {
        const sourceRepo = yield* $(SourceRepository)
        const actual = yield* $(sourceRepo.getAllSourcesByCo2ProducerId('1'))
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
      }).pipe(runTest(makeSource())))

    it('transforms markdown to html in description', () =>
      Effect.gen(function* ($) {
        const sourceRepo = yield* $(SourceRepository)
        const actual = yield* $(sourceRepo.getAllSourcesByCo2ProducerId('1'))
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
      }).pipe(
        runTest(
          makeSource({
            description: 'Some **bold** text with a [link](https://link.to)',
          }),
        ),
      ))
  })
})

function runTest(mockData: Source) {
  return <A, E>(effect: Effect.Effect<A, E, SourceRepository>) => {
    const DbTest = Layer.succeed(
      DB,
      DB.of(
        mock({
          sources: {
            getAllByProducerId: () => Effect.succeed([mockData]),
          },
        }),
      ),
    )

    const SourceRepoTest = SourceRepository.Live.pipe(Layer.provide(DbTest))

    return effect.pipe(Effect.provide(SourceRepoTest), Effect.runPromise)
  }
}
