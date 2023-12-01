import type { Config } from 'drizzle-kit'

export default {
  schema: './infra/db/schema.ts',
  dbCredentials: {
    uri: 'mysql://root:password@127.0.0.1:3306/co2data-org',
  },
  driver: 'mysql2',
  out: './infra/db/',
} satisfies Config
