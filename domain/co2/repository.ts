import { DB, type DbError } from '@/adapter/db'
import {
  type Co2Average as DbCo2Average,
  co2Average,
} from '@/adapter/db/schema'
import type { Co2Average } from '@/domain/co2'
import { desc, eq } from 'drizzle-orm'
import { Effect, Layer, Option, Array as ReadonlyArray } from 'effect'

export type _Co2Repository = {
  readonly getAllCo2Averages: Effect.Effect<Co2Average[], DbError>
  readonly getCo2AverageBySlug: (
    slug: string,
  ) => Effect.Effect<Option.Option<Co2Average>, DbError>
}

const make = Effect.gen(function* ($) {
  const db = yield* $(DB)

  return Co2Repository.of({
    getAllCo2Averages: db.co2Averages
      .findMany({ orderBy: desc(co2Average.avgPerYear) })
      .pipe(
        Effect.map(ReadonlyArray.map(co2AverageFromDbToDomain)),
        Effect.withSpan('getAllCo2Averages'),
      ),
    getCo2AverageBySlug: (slug) => {
      return db.co2Averages
        .findOne({ where: eq(co2Average.slug, slug) })
        .pipe(
          Effect.map(Option.map(co2AverageFromDbToDomain)),
          Effect.withSpan('getCo2AverageBySlug'),
        )
    },
  })
})

export class Co2Repository extends Effect.Tag('@services/Co2Repository')<
  Co2Repository,
  _Co2Repository
>() {
  static Live = Layer.effect(this, make)
}

function co2AverageFromDbToDomain(co2Average: DbCo2Average) {
  return {
    ...co2Average,
    description: Option.fromNullable(co2Average.description),
    avgPerYear: Number(co2Average.avgPerYear ?? 1),
    avgPerUnit: co2Average.avgPerUnit ?? 1,
  }
}
