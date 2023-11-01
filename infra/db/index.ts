import { Source } from '@/domain/source'
import { BaseError } from '@/lib/types'
import { connect } from '@planetscale/database'
import { SQL, eq } from 'drizzle-orm'
import { drizzle as planetscaleDrizzle } from 'drizzle-orm/planetscale-serverless'
import { Config, Context, Data, Effect, Layer, ReadonlyArray } from 'effect'
import { combineLinks } from './combine-source-links'
import * as schema from './schema'

export type DB = {
  co2Averages: {
    readonly findMany: typeof findMany
    readonly findOne: typeof findOne
  }
  sources: {
    readonly getAllByProducerId: (
      id: string
    ) => Effect.Effect<never, DbError, Source[]>
  }
}

export const DB = Context.Tag<DB>()

export const DbLive = Layer.succeed(
  DB,
  DB.of({
    co2Averages: {
      findMany,
      findOne,
    },
    sources: {
      getAllByProducerId,
    },
  })
)

const database = Effect.config(Config.string('DATABASE_URL')).pipe(
  Effect.orDie,
  Effect.flatMap((url) =>
    Effect.sync(() => planetscaleDrizzle(connect({ url }), { schema }))
  )
)
function findOne({ where }: { where: SQL<unknown> }) {
  return database.pipe(
    Effect.flatMap((db) =>
      Effect.tryPromise({
        try: () => db.select().from(schema.co2Average).where(where),
        catch: handleDbError,
      })
    ),
    Effect.tap((data) =>
      Effect.logDebug(`Read from DB: ${data.map((entry) => `${entry.slug}`)}`)
    ),
    Effect.map(ReadonlyArray.head)
  )
}

function findMany({ orderBy }: { orderBy?: SQL<unknown> } = {}) {
  return database.pipe(
    Effect.flatMap((db) =>
      Effect.tryPromise({
        try: () => {
          const selectFrom = db.select().from(schema.co2Average)
          const query = orderBy ? selectFrom.orderBy(orderBy) : selectFrom
          return query
        },
        catch: handleDbError,
      })
    ),
    Effect.tap((data) =>
      Effect.logDebug(`Read from DB: ${data.map((entry) => `${entry.slug}`)}`)
    )
  )
}

function getAllByProducerId(id: string) {
  return database.pipe(
    Effect.flatMap((db) =>
      Effect.tryPromise({
        try: () =>
          db
            .select({
              id: schema.sourcedCo2Amounts.id,
              gCo2e: schema.sourcedCo2Amounts.gCo2E,
              per: schema.sourcedCo2Amounts.per,
              quote: schema.sourcedCo2Amounts.quote,
              description: schema.sourcedCo2Amounts.description,
              userId: schema.sourcedCo2Amounts.userId,
              name: schema.sources.name,
              year: schema.sources.year,
              region: schema.sources.region,
              sourcesId: schema.sources.id,
              links: schema.links,
            })
            .from(schema.sourcedCo2Amounts)
            .innerJoin(
              schema.sources,
              eq(schema.sourcedCo2Amounts.sourceId, schema.sources.id)
            )
            .leftJoin(
              schema.links,
              eq(schema.sourcedCo2Amounts.sourceId, schema.links.sourcesId)
            )
            .where(eq(schema.sourcedCo2Amounts.co2ProducerId, id)),
        catch: handleDbError,
      })
    ),
    Effect.map(combineLinks),
    Effect.tap(Effect.logDebug)
  )
}

export class DbError extends Data.TaggedError('DbError')<BaseError> {}

function handleDbError(cause: unknown) {
  console.error(`DbError: ${cause}`)
  return new DbError({ cause })
}
