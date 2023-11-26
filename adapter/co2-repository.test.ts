import { Co2Average, Co2Repository, co2RepoLive } from '@/domain/co2'
import { DB, DbError, DbLive } from '@/infra/db'
import { mockPlanetScale } from '@/infra/mock/server'
import { ConfigProvider, Effect, Layer, Option } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, test } from 'vitest'
import { Co2RepositoryLive } from './co2-repository'
import * as schema from '@/infra/db/schema'

describe('co2-repository', () => {
  test('getCo2AverageBySlug Live (mock network)', async () => {
    const mockData = {
      id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
      title: 'Grains',
      description: 'test',
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

    mockPlanetScale([mockData])

    const actual = await runWithLiveDb((repo) =>
      repo.getCo2AverageBySlug('test')
    )

    expect(actual).toStrictEqual(
      Option.some({
        avgPerUnit: 27000,
        avgPerYear: 675000,
        description: {
          value: 'test',
        },
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        singleConsumptionAverage: 0.05,
        singleConsumptionFrom: 0,
        singleConsumptionTo: 0.5,
        slug: 'test',
        timesPerYearAverage: 500,
        timesPerYearFrom: 0,
        timesPerYearTo: 1000,
        title: 'Grains',
        unit: 'kilogram',
      })
    )
  })

  test('getAllCo2Averages Live (mock network)', async () => {
    const mockData = [
      {
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        title: 'Grains',
        description: 'test',
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
      },
    ]

    mockPlanetScale(mockData)
    const actual = await runWithLiveDb((repo) => repo.getAllCo2Averages())

    expect(actual).toStrictEqual([
      {
        avgPerUnit: 27000,
        avgPerYear: 675000,
        description: {
          value: 'test',
        },
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        singleConsumptionAverage: 0.05,
        singleConsumptionFrom: 0,
        singleConsumptionTo: 0.5,
        slug: 'test',
        timesPerYearAverage: 500,
        timesPerYearFrom: 0,
        timesPerYearTo: 1000,
        title: 'Grains',
        unit: 'kilogram',
      },
    ])
  })

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

function runWithLiveDb(
  f: (repo: Co2Repository) => Effect.Effect<never, DbError, any>
) {
  const ConfigTest = ConfigProvider.fromMap(
    new Map([
      [
        'DATABASE_URL',
        'mysql://xxxx:xxxxx@eu-central.connect.psdb.cloud/co2data-org',
      ],
    ])
  ).pipe(Layer.setConfigProvider)

  const Co2RepositoryLiveConfigTest = Co2RepositoryLive.pipe(
    Layer.use(DbLive),
    Layer.use(ConfigTest)
  )
  return Co2Repository.pipe(
    Effect.flatMap(f),
    Effect.provide(Co2RepositoryLiveConfigTest),
    Effect.runPromise
  )
}

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

  const Co2RepositoryTest = Co2RepositoryLive.pipe(Layer.use(DbTest))

  const getAllCo2Averages = Co2Repository.pipe(
    Effect.flatMap(f),
    Effect.provide(Co2RepositoryTest),
    Effect.runPromise
  )
  return getAllCo2Averages
}
