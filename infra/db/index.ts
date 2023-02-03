import { createPool } from 'mysql2'
import { Kysely, MysqlDialect } from 'kysely'
import { DB } from './types'
import { PlanetScaleDialect } from 'kysely-planetscale'

const dialect =
  process.env.NODE_ENV === 'development'
    ? new MysqlDialect({
        pool: createPool({
          host: '127.0.0.1',
          user: 'root',
          password: 'password',
          database: 'mydb',
        }),
      })
    : new PlanetScaleDialect({ url: process.env.DATABASE_URL })

export const db = new Kysely<DB>({ dialect })
