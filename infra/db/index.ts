import { createPool } from 'mysql2'
import { Kysely, MysqlDialect } from 'kysely'
import { DB } from './types'
import { PlanetScaleDialect } from 'kysely-planetscale'
declare global {
  var EdgeRuntime: string | undefined
}
const dialect =
  process.env.NODE_ENV !== 'development' ||
  typeof globalThis.EdgeRuntime === 'string'
    ? new PlanetScaleDialect({ url: process.env.DATABASE_URL })
    : new MysqlDialect({
        pool: createPool({
          host: '127.0.0.1',
          user: 'root',
          password: 'password',
          database: 'co2data-org',
        }),
      })

export const db = new Kysely<DB>({ dialect })
