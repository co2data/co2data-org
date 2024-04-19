import { DB } from '@/adapter/db'
import type * as schema from '@/adapter/db/schema'
import { type Co2Average, Co2Repository } from '@/domain/co2'
import { Effect, Layer, Option } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, test } from 'vitest'

describe('co2-repository', () => {
  test('getAllCo2Averages (mock DB)', () =>
    Effect.gen(function* ($) {
      const expected: Co2Average = {
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        title: 'Grains',
        description: Option.none(),
        slug: 'test',
        unit: 'kilogram',
        avgPerYear: 675000,
        avgPerUnit: 27000,
        singleConsumptionFrom: 0,
        singleConsumptionTo: 0.5,
        singleConsumptionAverage: 0.05,
        timesPerYearFrom: 0,
        timesPerYearTo: 1000,
        timesPerYearAverage: 500,
      }

      const repo = yield* $(Co2Repository)
      const actual = yield* $(repo.getAllCo2Averages())

      expect(actual).toStrictEqual([expected])
    }).pipe(
      runTest({
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        title: 'Grains',
        description: null,
        slug: 'test',
        unit: 'kilogram',
        avgPerYear: '675000',
        avgPerUnit: 27000,
        singleConsumptionFrom: 0,
        singleConsumptionTo: 0.5,
        singleConsumptionAverage: 0.05,
        timesPerYearFrom: 0,
        timesPerYearTo: 1000,
        timesPerYearAverage: 500,
      }),
    ))

  test('getCo2AveragesBySlug (mock DB)', () =>
    Effect.gen(function* ($) {
      const expected: Co2Average = {
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        title: 'Grains',
        description: Option.none(),
        slug: 'test',
        unit: 'kilogram',
        avgPerYear: 675000,
        avgPerUnit: 27000,
        singleConsumptionFrom: 0,
        singleConsumptionTo: 0.5,
        singleConsumptionAverage: 0.05,
        timesPerYearFrom: 0,
        timesPerYearTo: 1000,
        timesPerYearAverage: 500,
      }

      const repo = yield* $(Co2Repository)
      const actual = yield* $(repo.getCo2AverageBySlug('test'))

      expect(actual).toStrictEqual(Option.some(expected))
    }).pipe(
      runTest({
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        title: 'Grains',
        description: null,
        slug: 'test',
        unit: 'kilogram',
        avgPerYear: '675000',
        avgPerUnit: 27000,
        singleConsumptionFrom: 0,
        singleConsumptionTo: 0.5,
        singleConsumptionAverage: 0.05,
        timesPerYearFrom: 0,
        timesPerYearTo: 1000,
        timesPerYearAverage: 500,
      }),
    ))
})

function runTest(mockData: schema.Co2Average) {
  return <A, E>(effect: Effect.Effect<A, E, Co2Repository>) => {
    const DbTest = Layer.succeed(
      DB,
      DB.of(
        mock({
          co2Averages: {
            findMany: () => Effect.succeed([mockData]),
            findOne: () => Effect.succeed(Option.some(mockData)),
          },
        }),
      ),
    )

    const Co2RepositoryTest = Co2Repository.Live.pipe(Layer.provide(DbTest))

    return effect.pipe(Effect.provide(Co2RepositoryTest), Effect.runPromise)
  }
}
