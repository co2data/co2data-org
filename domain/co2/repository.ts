import { DB } from '@/adapter/db'
import {
  type Co2Average as DbCo2Average,
  co2Average,
} from '@/adapter/db/schema'
import { desc, eq } from 'drizzle-orm'
import { Effect, Layer, Option, Array as ReadonlyArray } from 'effect'

const make = Effect.gen(function* ($) {
  const db = yield* $(DB)

  return {
    getAllCo2Averages: db.co2Averages
      .findMany({ orderBy: desc(co2Average.avgPerYear) })
      .pipe(
        Effect.map(ReadonlyArray.map(co2AverageFromDbToDomain)),
        Effect.withSpan('getAllCo2Averages'),
      ),
    getCo2AverageBySlug: (slug: string) => {
      return db.co2Averages
        .findOne({ where: eq(co2Average.slug, slug) })
        .pipe(
          Effect.map(Option.map(co2AverageFromDbToDomain)),
          Effect.withSpan('getCo2AverageBySlug'),
        )
    },
  }
})

export class Co2Repository extends Effect.Tag('@services/Co2Repository')<
  Co2Repository,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make).pipe(Layer.provide(DB.Live))
  static Test = (DbTest: Layer.Layer<DB>) =>
    Layer.effect(this, make).pipe(Layer.provide(DbTest))
}

function co2AverageFromDbToDomain(co2Average: DbCo2Average) {
  return {
    ...co2Average,
    description: Option.fromNullable(co2Average.description),
    avgPerYear: Number(co2Average.avgPerYear ?? 1),
    avgPerUnit: co2Average.avgPerUnit ?? 1,
  }
}
