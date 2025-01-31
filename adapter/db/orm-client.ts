import type { CloudflareContext } from '@opennextjs/cloudflare'
import { type DrizzleD1Database, drizzle as d1Drizzle } from 'drizzle-orm/d1'
import { Context, Layer } from 'effect'
import * as schema from './schema'
export class OrmClient extends Context.Tag('@adapter/db/orm-client')<
  OrmClient,
  (db: CloudflareContext['env']['DB']) => DrizzleD1Database<typeof schema>
>() {
  static D1Drizzle = Layer.succeed(this, (db) => d1Drizzle(db, { schema }))
}
