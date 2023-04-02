import { mockPlanetScale } from '@/infra/mock/server'
import { describe, expect, test } from 'vitest'
import repo from './co2-repository'

describe('co2-repository', () => {
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

    const actual = await repo().getCo2AverageBySlug('test')

    expect(actual).toStrictEqual(mockData[0])
  })
})
