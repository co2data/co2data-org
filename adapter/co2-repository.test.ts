import { Co2Repository, repository } from '@/domain/co2'
import { mockPlanetScale } from '@/infra/mock/server'
import { Effect, Option } from 'effect'
import { describe, expect, test } from 'vitest'

describe('co2-repository', () => {
  test('getCo2AverageBySlug', async () => {
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

    const actual = await Co2Repository.pipe(
      Effect.flatMap((repo) => repo.getCo2AverageBySlug('test')),
      Effect.provideLayer(repository),
      Effect.runPromise
    )

    expect(actual).toStrictEqual(Option.some(mockData))
  })

  test('getAllCo2Averages', async () => {
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

    const actual = await Co2Repository.pipe(
      Effect.flatMap((repo) => repo.getAllCo2Averages()),
      Effect.provideLayer(repository),
      Effect.runPromise
    )

    expect(actual).toStrictEqual(mockData)
  })
})
