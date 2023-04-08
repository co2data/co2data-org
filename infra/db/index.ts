import { drizzle as planetscaleDrizzle } from 'drizzle-orm/planetscale-serverless'
import { drizzle as mysqlDrizzle } from 'drizzle-orm/mysql2'

import { connect } from '@planetscale/database'

const connection = () => {
  switch (process.env.NODE_ENV) {
    // case 'development': {
    //   console.log(
    //     `Loading MySQL driver for local development environment @${
    //       process.env.DATABASE_URL?.split('@')[1]
    //     }`
    //   )

    //   const { createPool } = require('mysql2/promise')
    //   const connection = createPool({
    //     host: '127.0.0.1',
    //     user: 'root',
    //     password: 'password',
    //     database: 'co2data-org',
    //   })

    //   return mysqlDrizzle(connection)
    // }
    case 'test': {
      console.log('Loading test db connection...')

      const connection = connect({ url: 'mysql://test:test@psdb.cloud/db' })
      return planetscaleDrizzle(connection)
    }

    default: {
      console.log(
        `Making Planetscale db connection to ${
          process.env.DATABASE_URL?.split('@')[1]
        }...`
      )

      const connection = connect({ url: process.env.DATABASE_URL })
      return planetscaleDrizzle(connection)
    }
  }
}

export const db = connection()
