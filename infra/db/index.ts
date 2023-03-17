import { Kysely, MysqlDialect } from 'kysely'
import { DB } from './types'
import { PlanetScaleDialect } from 'kysely-planetscale'

const dialect = () => {
  switch (process.env.NODE_ENV) {
    case 'development': {
      const { createPool } = require('mysql2')
      return new MysqlDialect({
        pool: createPool({
          host: '127.0.0.1',
          user: 'root',
          password: 'password',
          database: 'co2data-org',
        }),
      })
    }

    default:
      return new PlanetScaleDialect({ url: process.env.DATABASE_URL })
  }
}

export const db = new Kysely<DB>({ dialect: dialect() })
