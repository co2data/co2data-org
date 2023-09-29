import { Co2Average } from '@/domain/co2'
import { DB, DbError } from '@/infra/db'
import { co2Average } from '@/infra/db/schema'
import { desc, eq } from 'drizzle-orm'
import { ReadonlyArray as Array, Context, Effect, Layer, Option } from 'effect'

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
        return db.co2Averages.getAll()
      },
      getCo2AverageBySlug: (slug) => {
        return db.co2Averages.getBySlug(slug)
      },
    })
  )
)
