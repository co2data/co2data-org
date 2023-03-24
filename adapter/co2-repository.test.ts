import { describe, expect, test } from 'vitest'

import co2Repository, { createCo2AveragesTestData } from './co2-repository'

describe('co2-repository', () => {
  test('getAllCo2Averages', async () => {
    const repo = setup()
    const actual = await repo.getCo2AverageBySlug('test')
    expect(actual).toStrictEqual({
      avg_per_unit: 22,
      avg_per_year: 2222,
      single_consumption_average: 2,
      single_consumption_from: 1,
      single_consumption_to: 10,
      slug: 'test',
      times_per_year_average: 50,
      times_per_year_from: 1,
      times_per_year_to: 200,
      title: 'Test',
      unit: 'kilometer',
      id: 'test',
    })
  })
})

const setup = () => {
  return co2Repository(createCo2AveragesTestData())
}
