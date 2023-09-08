import { Co2Average } from '@/domain/co2'
import { DB } from '@/infra/db'
import { co2Average } from '@/infra/db/schema'
import { desc, eq } from 'drizzle-orm'
import { ReadonlyArray as Array, Context, Effect, Layer, Option } from 'effect'

export type Co2Repository = {
  readonly getAllCo2Averages: () => Effect.Effect<never, unknown, Co2Average[]>
  readonly getCo2AverageBySlug: (
    slug: string
  ) => Effect.Effect<never, unknown, Option.Option<Co2Average>>
}

export const Co2Repository = Context.Tag<Co2Repository>()

export const Co2RepositoryLive = Layer.effect(
  Co2Repository,
  Effect.map(DB, (db) =>
    Co2Repository.of({
      getAllCo2Averages: () => {
        return db.pipe(
          Effect.flatMap((db) =>
            Effect.tryPromise(() =>
              db.select().from(co2Average).orderBy(desc(co2Average.avgPerYear))
            )
          ),
          Effect.map(
            Array.map((co2Average) => ({
              ...co2Average,
              avgPerYear: Number(co2Average.avgPerYear ?? 1),
              avgPerUnit: co2Average.avgPerUnit ?? 1,
            }))
          )
        )
      },
      getCo2AverageBySlug: (slug) => {
        return db.pipe(
          Effect.flatMap((db) =>
            Effect.tryPromise(() =>
              db.select().from(co2Average).where(eq(co2Average.slug, slug))
            )
          ),
          Effect.map(Array.head),
          Effect.map(
            Option.map((first) => ({
              ...first,
              avgPerYear: Number(first.avgPerYear ?? 1),
              avgPerUnit: first.avgPerUnit ?? 1,
            }))
          )
        )
      },
    })
  )
)
