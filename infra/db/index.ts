import { connect } from '@planetscale/database'
import {
  PlanetScaleDatabase,
  drizzle as planetscaleDrizzle,
} from 'drizzle-orm/planetscale-serverless'
import { Context, Effect, Layer } from 'effect'

export type DB = Effect.Effect<
  never,
  never,
  PlanetScaleDatabase<Record<string, never>>
>

export const DB = Context.Tag<DB>()

const connection = connect({ url: process.env.DATABASE_URL })

export const db = planetscaleDrizzle(connection)

export const DbLive = Layer.succeed(
  DB,
  DB.of(Effect.succeed(planetscaleDrizzle(connection)))
)
