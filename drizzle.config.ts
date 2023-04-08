import type { Config } from 'drizzle-kit'

export default {
  schema: './migrations/schema.ts',
  connectionString: 'mysql://root:password@127.0.0.1:3306/co2data-org',
} satisfies Config
