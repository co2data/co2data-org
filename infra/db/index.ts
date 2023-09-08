import {
  PlanetScaleDatabase,
  drizzle as planetscaleDrizzle,
} from 'drizzle-orm/planetscale-serverless'
import { drizzle as mysqlDrizzle } from 'drizzle-orm/mysql2'
import { Effect, Context } from 'effect'
import { connect } from '@planetscale/database'

export type DB = Effect.Effect<
  never,
  never,
  PlanetScaleDatabase<Record<string, never>>
>

export const DB = Context.Tag<DB>()

const connection = connect({ url: process.env.DATABASE_URL })

const { createPool } = require('mysql2/promise')
const pool = createPool({
  host: '127.0.0.1',
  user: 'root',
  database: 'co2data-org',
})

const mysql = mysqlDrizzle(pool)

export const db = planetscaleDrizzle(connection)
