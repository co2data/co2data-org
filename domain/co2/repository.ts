import { DB, DbError } from '@/adapter/db'
import { co2Average, Co2Average as DbCo2Average } from '@/adapter/db/schema'
import { Co2Average } from '@/domain/co2'
import { desc, eq } from 'drizzle-orm'
import { Context, Effect, Layer, Option, ReadonlyArray } from 'effect'

export type Co2Repository = {
  readonly getAllCo2Averages: () => Effect.Effect<never, DbError, Co2Average[]>
  readonly getCo2AverageBySlug: (
    slug: string
  ) => Effect.Effect<never, DbError, Option.Option<Co2Average>>
}

export const Co2Repository = Context.Tag<Co2Repository>()

export const Co2RepositoryLive = DB.pipe(
  Effect.map(make),
  Layer.effect(Co2Repository)
)

function make(db: DB): Co2Repository {
  return Co2Repository.of({
    getAllCo2Averages: () => {
      return db.co2Averages
        .findMany({ orderBy: desc(co2Average.avgPerYear) })
        .pipe(
          Effect.map(ReadonlyArray.map(co2AverageFromDbToDomain)),
          Effect.withSpan('getAllCo2Averages')
        )
    },
    getCo2AverageBySlug: (slug) => {
      return db.co2Averages
        .findOne({ where: eq(co2Average.slug, slug) })
        .pipe(
          Effect.map(Option.map(co2AverageFromDbToDomain)),
          Effect.withSpan('getCo2AverageBySlug')
        )
    },
  })
}

function co2AverageFromDbToDomain(co2Average: DbCo2Average) {
  return {
    ...co2Average,
    description: Option.fromNullable(co2Average.description),
    avgPerYear: Number(co2Average.avgPerYear ?? 1),
    avgPerUnit: co2Average.avgPerUnit ?? 1,
  }
}
