import { Co2Average } from '@/domain/co2'
import { DB, DbError } from '@/infra/db'
import { co2Average } from '@/infra/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Context, Effect, Layer, Option, ReadonlyArray } from 'effect'

import * as schema from '@/infra/db/schema'

export type Co2Repository = {
  readonly getAllCo2Averages: () => Effect.Effect<never, DbError, Co2Average[]>
  readonly getCo2AverageBySlug: (
    slug: string
  ) => Effect.Effect<never, DbError, Option.Option<Co2Average>>
}

export const Co2Repository = Context.Tag<Co2Repository>()

export const Co2RepositoryLive = Layer.effect(
  Co2Repository,
  Effect.map(DB, (db) =>
    Co2Repository.of({
      getAllCo2Averages: () => {
        return db.co2Averages
          .findMany({ orderBy: desc(co2Average.avgPerYear) })
          .pipe(Effect.map(ReadonlyArray.map(co2AverageFromDbToDomain)))
      },
      getCo2AverageBySlug: (slug) => {
        return db.co2Averages
          .findOne({ where: eq(co2Average.slug, slug) })
          .pipe(Effect.map(Option.map(co2AverageFromDbToDomain)))
      },
    })
  )
)

function co2AverageFromDbToDomain(co2Average: schema.Co2Average) {
  return {
    ...co2Average,
    description: Option.fromNullable(co2Average.description),
    avgPerYear: Number(co2Average.avgPerYear ?? 1),
    avgPerUnit: co2Average.avgPerUnit ?? 1,
  }
}
