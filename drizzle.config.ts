import type { Config } from 'drizzle-kit'

export default {
  schema: './adapter/db/schema.ts',
  dbCredentials: {
    connectionString:
      process.env.DATABASE_CONNECTION ??
      'socket:/tmp/devenv-349ad88/postgres?db=mydb',
  },
  driver: 'pg',
  out: './adapter/db/migrations-folder',
} satisfies Config
