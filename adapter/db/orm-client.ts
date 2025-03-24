import {
  type LibSQLDatabase,
  drizzle as libSqlDrizzle,
} from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { Context, Layer } from 'effect'
import * as schema from './schema'

const makeOrmClient = () => {
  const url =
    process.env.BUILDING === 'true' ? ':memory:' : (process.env.DB_URL ?? '')
  console.log('url', url)
  const ormClient = libSqlDrizzle(url, {
    schema,
    casing: 'snake_case',
  })
  migrate(ormClient, { migrationsFolder: 'drizzle' })
  return ormClient
}

export class OrmClient extends Context.Tag('@adapter/db/orm-client')<
  OrmClient,
  LibSQLDatabase<typeof schema>
>() {
  static LibSqlDrizzle = Layer.succeed(this, makeOrmClient())
}
