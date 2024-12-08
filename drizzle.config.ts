import type { Config } from 'drizzle-kit'

export default {
  dialect: 'postgresql',
  schema: './adapter/db/schema.ts',
  dbCredentials: {
    url:
      process.env.DATABASE_CONNECTION ??
      'socket:/tmp/devenv-349ad88/postgres?db=mydb',
  },
  out: './adapter/db/migrations-folder',
} satisfies Config
