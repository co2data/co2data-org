import { Co2Average } from '@/domain/co2'
import { Source } from '@/domain/source'
import { BaseError } from '@/lib/types'
import { connect } from '@planetscale/database'
import { InferSelectModel, SQL, desc, eq } from 'drizzle-orm'
import { drizzle as planetscaleDrizzle } from 'drizzle-orm/planetscale-serverless'
import { Context, Data, Effect, Layer, Option, ReadonlyArray } from 'effect'
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

const connection = connect({ url: process.env.DATABASE_URL })

export const db = planetscaleDrizzle(connection, { schema })
type DbDrizzle = typeof db
export class DbError extends Data.TaggedClass('DbError')<BaseError> {}
export type DbFrom = ReturnType<ReturnType<DbDrizzle['select']>['from']>

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
function getAllByProducerId(id: string) {
  return Effect.tryPromise({
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
  }).pipe(
    Effect.map((d) =>
      d.reduce<Source[]>((acc, source) => {
        const existing = acc.find((e) => e.id === source.id)
        if (existing) {
          return [
            ...acc.filter((e) => e.id === source.id),
            {
              ...existing,
              links: Option.map(
                existing.links,
                ReadonlyArray.appendAll(
                  ReadonlyArray.fromNullable(source.links)
                )
              ).pipe(
                Option.orElse(() =>
                  Option.fromNullable(source.links).pipe(
                    Option.map(ReadonlyArray.of)
                  )
                )
              ),
            },
          ]
        }
        acc.push({
          ...source,
          links: Option.fromNullable(source.links).pipe(
            Option.map(ReadonlyArray.of)
          ),
        })
        return acc
      }, [])
    )
  )
}

function findMany({ orderBy }: { orderBy?: SQL<unknown> } = {}) {
  const selectFrom = db.select().from(schema.co2Average)
  const query = orderBy ? selectFrom.orderBy(orderBy) : selectFrom
  return Effect.tryPromise({
    try: () => query,
    catch: handleDbError,
  })
}
function findOne({ where }: { where: SQL<unknown> }) {
  const selectFrom = db.select().from(schema.co2Average)
  const query = selectFrom.where(where)
  return Effect.tryPromise({
    try: () => query,
    catch: handleDbError,
  }).pipe(Effect.map(ReadonlyArray.head))
}

function handleDbError(cause: unknown) {
  console.error(`DbError: ${cause}`)
  return new DbError({ cause })
}
