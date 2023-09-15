import { Co2Repository } from '@/adapter/co2-repository'
import { Co2Average } from '@/domain/co2'
import { render, screen } from '@testing-library/react'
import { Effect, Layer, Option } from 'effect'
import { expect, test } from 'vitest'
import ContributorList from './contributor-list'

test('render no contributor found', async () => {
  const { container } = await setup({ mockData: [], searchParams: {} })
  expect(container).toMatchSnapshot()
})

test('render ', async () => {
  const mockData = [
    {
      id: 'id',
      title: 'Pork',
      slug: 'test',
      unit: 'kilogram',
      avgPerYear: 500000,
      avgPerUnit: 30000,
      singleConsumptionFrom: 0,
      singleConsumptionAverage: 4,
      singleConsumptionTo: 100,
      timesPerYearFrom: 0,
      timesPerYearAverage: 5,
      timesPerYearTo: 20,
    } satisfies Co2Average,
  ]
  const searchParams = { search: 'pork' }

  const { container } = await setup({ mockData, searchParams })
  expect(container).toMatchSnapshot()
})

test('has link to pork', async () => {
  const mockData = [
    {
      id: 'id',
      title: 'Pork',
      slug: 'test',
      unit: 'kilogram',
      avgPerYear: 500000,
      avgPerUnit: 30000,
      singleConsumptionFrom: 0,
      singleConsumptionAverage: 4,
      singleConsumptionTo: 100,
      timesPerYearFrom: 0,
      timesPerYearAverage: 5,
      timesPerYearTo: 20,
    } satisfies Co2Average,
  ]
  const searchParams = { search: 'pork' }

  await setup({ mockData, searchParams })
  const link = screen.getByRole('link', { name: 'Pork' })
  expect(link).toHaveAttribute('href', '/c/test')
})

async function setup(props: {
  mockData: Co2Average[]
  searchParams: { [key: string]: string | undefined }
}) {
  const co2RepoTest = Layer.succeed(
    Co2Repository,
    Co2Repository.of({
      getAllCo2Averages: () => Effect.succeed(props.mockData),
      getCo2AverageBySlug: (slug) => Effect.succeed(Option.none()),
    })
  )
  const result = await ContributorList({
    searchParams: props.searchParams,
    deps: { repository: co2RepoTest },
  })
  return render(result)
}
