import { Co2Average } from '@/domain/co2'
import { makeCo2Average } from '@/domain/co2/example-data'
import { Co2Repository } from '@/domain/co2/repository'
import { render, screen } from '@testing-library/react'
import { Effect, Layer, Option } from 'effect'
import { expect, test, vi } from 'vitest'
import { ContributorListEffect } from './contributor-list'

test('render no contributor found', async () => {
  const { container } = await setup({ mockData: [], searchParams: {} })
  expect(container).toMatchSnapshot()
})

test('render ', async () => {
  const searchParams = { search: 'pork' }

  const { container } = await setup({
    mockData: [makeCo2Average()],
    searchParams,
  })
  expect(container).toMatchSnapshot()
})

test('has link to pork', async () => {
  const searchParams = { search: 'pork' }

  await setup({ mockData: [makeCo2Average()], searchParams })
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
    }),
  )
  const result = await ContributorListEffect(props).pipe(
    Effect.provide(co2RepoTest),
    Effect.runPromise,
  )

  return render(result)
}
