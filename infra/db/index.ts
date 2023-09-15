import { connect } from '@planetscale/database'
import { drizzle as planetscaleDrizzle } from 'drizzle-orm/planetscale-serverless'
import { Context, Effect, Layer } from 'effect'
import * as schema from './schema'

export type DB = Effect.Effect<never, never, DbDrizzle>

export const DB = Context.Tag<DB>()

const connection = connect({ url: process.env.DATABASE_URL })

export const db = planetscaleDrizzle(connection, { schema })
type DbDrizzle = typeof db

export const DbLive = Layer.succeed(DB, DB.of(Effect.succeed(db)))
