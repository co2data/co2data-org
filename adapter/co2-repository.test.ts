import { Co2Average, Co2Repository, co2RepoLive } from '@/domain/co2'
import { DB, DbError } from '@/infra/db'
import { mockPlanetScale } from '@/infra/mock/server'
import { Effect, Layer, Option } from 'effect'
import { mock } from 'testtriple'
import { describe, expect, test } from 'vitest'
import { Co2RepositoryLive } from './co2-repository'

describe('co2-repository', () => {
  test('getCo2AverageBySlug Live (mock network)', async () => {
    const mockData = {
      id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
      title: 'Grains',
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

    expect(actual).toStrictEqual(Option.some(mockData))
  })

  test('getAllCo2Averages Live (mock network)', async () => {
    const mockData = [
      {
        id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
        title: 'Grains',
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

    expect(actual).toStrictEqual(mockData)
  })

  test('getAllCo2Averages (mock DB)', async () => {
    const mockData: Co2Average = {
      id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
      title: 'Grains',
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
    expect(actual).toStrictEqual([mockData])
  })

  test('getCo2AveragesBySlug (mock DB)', async () => {
    const mockData: Co2Average = {
      id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
      title: 'Grains',
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

    expect(actual).toStrictEqual(Option.some(mockData))
  })
})

function runWithLiveDb(
  f: (repo: Co2Repository) => Effect.Effect<never, DbError, any>
) {
  return Co2Repository.pipe(
    Effect.flatMap(f),
    Effect.provideLayer(co2RepoLive),
    Effect.runPromise
  )
}

function runWithTestDb(
  f: (repo: Co2Repository) => Effect.Effect<never, DbError, any>,
  mockData: Co2Average
) {
  const DbTest = Layer.succeed(
    DB,
    DB.of(
      mock({
        co2Averages: {
          getAll: () => Effect.succeed([mockData]),
          getBySlug: (slug) => Effect.succeed(Option.some(mockData)),
        },
      })
    )
  )

  const Co2RepoTest = Co2RepositoryLive.pipe(Layer.use(DbTest))

  const getAllCo2Averages = Co2Repository.pipe(
    Effect.flatMap(f),
    Effect.provideLayer(Co2RepoTest),
    Effect.runPromise
  )
  return getAllCo2Averages
}
