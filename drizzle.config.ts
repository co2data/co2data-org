import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  out: './drizzle',
  schema: './adapter/db/schema.ts',
  dialect: 'sqlite',
  casing: 'snake_case',
  dbCredentials: {
    url: 'file:data.sqlite',
  },
})
