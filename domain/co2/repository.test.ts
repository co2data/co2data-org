import { DB, DbError } from '@/adapter/db'
import * as schema from '@/adapter/db/schema'
import { Co2Average, Co2Repository } from '@/domain/co2'
import { Effect, Layer, Option } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, test } from 'vitest'
import { Co2RepositoryLive } from './repository'

describe('co2-repository', () => {
  test('getAllCo2Averages (mock DB)', async () => {
    const mockData: schema.Co2Average = {
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
    }

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

    const actual = await runWithTestDb(
      (repo) => repo.getAllCo2Averages(),
      mockData
    )
    expect(actual).toStrictEqual([expected])
  })

  test('getCo2AveragesBySlug (mock DB)', async () => {
    const mockData: schema.Co2Average = {
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
    }

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

    const actual = await runWithTestDb(
      (repo) => repo.getCo2AverageBySlug('test'),
      mockData
    )

    expect(actual).toStrictEqual(Option.some(expected))
  })
})

function runWithTestDb(
  f: (repo: Co2Repository) => Effect.Effect<never, DbError, any>,
  mockData: schema.Co2Average
) {
  const DbTest = Layer.succeed(
    DB,
    DB.of(
      mock({
        co2Averages: {
          findMany: () => Effect.succeed([mockData]),
          findOne: () => Effect.succeed(Option.some(mockData)),
        },
      })
    )
  )

  const Co2RepositoryTest = Co2RepositoryLive.pipe(Layer.provide(DbTest))

  const getAllCo2Averages = Co2Repository.pipe(
    Effect.flatMap(f),
    Effect.provide(Co2RepositoryTest),
    Effect.runPromise
  )
  return getAllCo2Averages
}
