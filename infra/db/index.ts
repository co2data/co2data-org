import { createPool } from 'mysql2'
import { Kysely, MysqlDialect } from 'kysely'
import { DB } from './types'
import { PlanetScaleDialect } from 'kysely-planetscale'
declare global {
  var EdgeRuntime: string | undefined
}
const dialect = new PlanetScaleDialect({ url: process.env.DATABASE_URL })

export const db = new Kysely<DB>({ dialect })
