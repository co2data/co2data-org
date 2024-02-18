import { Source } from '@/domain/source'
import { BaseError } from '@/lib/types'
import { connect } from '@planetscale/database'
import { SQL, eq } from 'drizzle-orm'
import {
  PlanetScaleDatabase,
  drizzle as planetscaleDrizzle,
} from 'drizzle-orm/planetscale-serverless'
import {
  Config,
  Context,
  Data,
  Effect,
  Layer,
  Option,
  ReadonlyArray,
} from 'effect'
import { combineLinks } from './combine-source-links'
import * as schema from './schema'

type _DB = {
  co2Averages: {
    readonly findMany: ({
      orderBy,
    }: {
      orderBy?: SQL<unknown>
    }) => Effect.Effect<schema.Co2Average[], DbError>
    readonly findOne: ({
      where,
    }: {
      where: SQL<unknown>
    }) => Effect.Effect<Option.Option<schema.Co2Average>, DbError>
  }
  sources: {
    readonly getAllByProducerId: (
      id: string,
    ) => Effect.Effect<Source[], DbError>
  }
  users: {
    readonly findOne: ({
      where,
    }: {
      where: SQL<unknown>
    }) => Effect.Effect<Option.Option<schema.SelectUsers>, DbError>
  }
  query: <A>(
    body: (client: PlanetScaleDatabase<typeof schema>) => Promise<A>,
  ) => Effect.Effect<A, DbError>
}

const make = Effect.gen(function* (_) {
  const url = yield* _(Config.string('DATABASE_URL'), Effect.orDie)
  const database = yield* _(
    Effect.sync(() => planetscaleDrizzle(connect({ url }), { schema })),
  )

  const query = <A>(body: (client: typeof database) => Promise<A>) =>
    Effect.tryPromise<A, DbError>({
      try: () => body(database),
      catch: handleDbError,
    })

  return DB.of({
    query,
    co2Averages: {
      findMany: ({ orderBy } = {}) =>
        Effect.tryPromise({
          try: () => {
            const selectFrom = database.select().from(schema.co2Average)
            const query = orderBy ? selectFrom.orderBy(orderBy) : selectFrom
            return query
          },
          catch: handleDbError,
        }).pipe(
          Effect.tap((data) =>
            Effect.logDebug(
              `Read from DB: ${data.map((entry) => `${entry.slug}`)}`,
            ),
          ),
          Effect.withSpan('findMany'),
        ),
      findOne: ({ where }) =>
        Effect.tryPromise({
          try: () => database.select().from(schema.co2Average).where(where),
          catch: handleDbError,
        }).pipe(
          Effect.tap((data) =>
            Effect.logDebug(
              `Read from DB: ${data.map((entry) => `${entry.slug}`)}`,
            ),
          ),
          Effect.map(ReadonlyArray.head),
          Effect.withSpan('findOne'),
        ),
    },
    sources: {
      getAllByProducerId: (id) =>
        Effect.tryPromise({
          try: () =>
            database
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
                eq(schema.sourcedCo2Amounts.sourceId, schema.sources.id),
              )
              .leftJoin(
                schema.links,
                eq(schema.sourcedCo2Amounts.sourceId, schema.links.sourcesId),
              )
              .where(eq(schema.sourcedCo2Amounts.co2ProducerId, id)),
          catch: handleDbError,
        }).pipe(
          Effect.map(combineLinks),
          Effect.tap(Effect.logDebug),
          Effect.withSpan('getAllByProducerId'),
        ),
    },
    users: {
      findOne: ({ where }) =>
        Effect.tryPromise({
          try: () => database.select().from(schema.users).where(where),
          catch: handleDbError,
        }).pipe(
          Effect.tap((data) =>
            Effect.logDebug(
              `Read from DB: ${data.map((entry) => `${entry.username}`)}`,
            ),
          ),
          Effect.map(ReadonlyArray.head),
          Effect.withSpan('findOne'),
        ),
    },
  })
})

export class DB extends Context.Tag('@app/db')<DB, _DB>() {
  static Live = Layer.effect(this, make)
}

export class DbError extends Data.TaggedError('DbError')<BaseError> {}

function handleDbError(cause: unknown) {
  console.error(`DbError: ${cause}`)
  return new DbError({ cause })
}
