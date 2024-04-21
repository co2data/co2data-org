import { DB } from '@/adapter/db'
import type { Source } from '@/domain/source'
import { makeSource } from '@/domain/source/example-data'
import { Effect, Layer } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, it } from 'vitest'
import { SourceRepository } from './repository'

describe('source repository', () => {
  describe('getAllByProducerId', () => {
    it('takes happy path', () =>
      Effect.gen(function* ($) {
        const actual = yield* $(
          SourceRepository.getAllSourcesByCo2ProducerId('1'),
        )
        expect(actual).toMatchInlineSnapshot(`
          [
            {
              "description": "<p>No description</p>
          ",
              "gCo2e": 2000,
              "id": "1",
              "links": {
                "_id": "Option",
                "_tag": "Some",
                "value": [
                  {
                    "id": "id1",
                    "mediaType": "xls",
                    "name": "Excel sheet",
                    "url": "https://some-server.domain/route.xls",
                  },
                ],
              },
              "name": "Sustainability Report 2018",
              "per": 1,
              "region": {
                "_id": "Option",
                "_tag": "Some",
                "value": "World",
              },
              "userId": "user1",
              "year": {
                "_id": "Option",
                "_tag": "Some",
                "value": 2018,
              },
            },
          ]
        `)
      }).pipe(runTest(makeSource())))

    it('transforms markdown to html in description', () =>
      Effect.gen(function* ($) {
        const actual = yield* $(
          SourceRepository.getAllSourcesByCo2ProducerId('1'),
        )
        expect(actual).toMatchInlineSnapshot(`
          [
            {
              "description": "<p>Some <strong>bold</strong> text with a <a href="https://link.to">link</a></p>
          ",
              "gCo2e": 2000,
              "id": "1",
              "links": {
                "_id": "Option",
                "_tag": "Some",
                "value": [
                  {
                    "id": "id1",
                    "mediaType": "xls",
                    "name": "Excel sheet",
                    "url": "https://some-server.domain/route.xls",
                  },
                ],
              },
              "name": "Sustainability Report 2018",
              "per": 1,
              "region": {
                "_id": "Option",
                "_tag": "Some",
                "value": "World",
              },
              "userId": "user1",
              "year": {
                "_id": "Option",
                "_tag": "Some",
                "value": 2018,
              },
            },
          ]
        `)
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
