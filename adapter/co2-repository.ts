import { cache as reactCache } from 'react'
import { Co2Repository } from '@/domain/co2'
import { db } from '@/infra/db'
import { Co2Average, DB, Decimal } from '@/infra/db/types'
import { mock, resolves, returns } from 'testtriple'

const isTest = process.env.NODE_ENV === 'test'
const cache = isTest ? (callback: any) => callback : reactCache

function makeCo2Repository(deps = { db, cache }): Co2Repository {
  return {
    getAllCo2Averages: deps.cache(async () => {
      const data = await deps.db.selectFrom('co2_average').selectAll().execute()
      return data.map((co2Average) => ({
        ...co2Average,
        avg_per_year: Number(co2Average.avg_per_year ?? 1),
        avg_per_unit: co2Average.avg_per_unit ?? 1,
      }))
    }),
    getCo2AverageBySlug: deps.cache(async (slug: string) => {
      const data = await deps.db
        .selectFrom('co2_average')
        .selectAll()
        .where('slug', '=', slug)
        .executeTakeFirst()
      if (data === undefined) return undefined
      return {
        ...data,
        avg_per_year: Number(data.avg_per_year ?? 1),
        avg_per_unit: data.avg_per_unit ?? 1,
      }
    }),
  }
}

const co2Repository = (testData?: Omit<Co2Average, 'id'>) =>
  testData ? co2RepositoryNullable(testData) : makeCo2Repository()

export const createCo2AveragesTestData = () => {
  return {
    avg_per_unit: 22,
    avg_per_year: '2222' as unknown as Decimal,
    single_consumption_average: 2,
    single_consumption_from: 1,
    single_consumption_to: 10,
    slug: 'test',
    times_per_year_average: 50,
    times_per_year_from: 1,
    times_per_year_to: 200,
    title: 'Test',
    unit: 'kilometer',
  } satisfies Omit<Co2Average, 'id'>
}

function co2RepositoryNullable(data: Omit<Co2Average, 'id'>): Co2Repository {
  return makeCo2Repository({
    cache(callback: any) {
      return callback
    },
    db: mock({
      selectFrom: returns(
        mock({
          selectAll: returns(
            mock({
              execute: resolves(
                mock([
                  mock<DB['co2_average'] & { id: string }>({
                    ...data,
                    id: mock('test'),
                  }),
                ])
              ),
              where: returns(
                mock({
                  executeTakeFirst: resolves(
                    mock<DB['co2_average'] & { id: string }>({
                      ...data,
                      id: mock('test'),
                    })
                  ),
                })
              ),
            })
          ),
        })
      ),
    }),
  })
}

export default co2Repository
