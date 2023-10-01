import { Co2Average } from '@/domain/co2'
import { Source } from '@/domain/source'
import { connect } from '@planetscale/database'
import { desc, eq } from 'drizzle-orm'
import { drizzle as planetscaleDrizzle } from 'drizzle-orm/planetscale-serverless'
import { Context, Effect, Layer, Option, ReadonlyArray } from 'effect'
import * as schema from './schema'

export type DB = {
  co2Averages: {
    readonly getAll: () => Effect.Effect<never, DbError, Co2Average[]>
    readonly getBySlug: (
      slug: string
    ) => Effect.Effect<never, DbError, Option.Option<Co2Average>>
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
export class DbError extends Error {
  readonly _tag = 'DbError'
}
export type DbFrom = ReturnType<ReturnType<DbDrizzle['select']>['from']>

export const DbLive = Layer.succeed(
  DB,
  DB.of({
    co2Averages: {
      getAll: () =>
        Effect.tryPromise({
          try: () =>
            db
              .select()
              .from(schema.co2Average)
              .orderBy(desc(schema.co2Average.avgPerYear)),
          catch: (cause) => new DbError('DB Error', { cause }),
        }).pipe(
          Effect.map(
            ReadonlyArray.map((co2Average) => ({
              ...co2Average,
              avgPerYear: Number(co2Average.avgPerYear ?? 1),
              avgPerUnit: co2Average.avgPerUnit ?? 1,
            }))
          )
        ),
      getBySlug: (slug) =>
        Effect.tryPromise({
          try: () =>
            db
              .select()
              .from(schema.co2Average)
              .where(eq(schema.co2Average.slug, slug)),
          catch: (cause) => new DbError('DB Error', { cause }),
        }).pipe(
          Effect.map(ReadonlyArray.head),
          Effect.map(
            Option.map((first) => ({
              ...first,
              avgPerYear: Number(first.avgPerYear ?? 1),
              avgPerUnit: first.avgPerUnit ?? 1,
            }))
          )
        ),
    },
    sources: {
      getAllByProducerId: (id) =>
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
          catch: (cause) => new DbError('DB Error', { cause }),
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
        ),
    },
  })
)
