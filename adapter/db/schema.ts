import type { AuthenticatorTransport } from '@simplewebauthn/types'
import { type InferSelectModel, relations, sql } from 'drizzle-orm'
import {
  blob,
  index,
  int,
  real,
  sqliteTable,
  sqliteView,
  text,
  unique,
} from 'drizzle-orm/sqlite-core'
import { nanoid } from 'nanoid'

export const units = text({
  enum: ['minute', 'liter', 'kilogram', 'meter', 'gram', 'hour', 'kilometer'],
})

const id = text('id')
  .primaryKey()
  .notNull()
  .$defaultFn(() => nanoid())
export const categories = sqliteTable('categories', {
  id: id,
  title: text().notNull(),
  slug: text({ length: 255 }).unique().notNull(),
})

export const users = sqliteTable('users', {
  id: id,
  username: text({ length: 255 }).notNull(),
  currentChallenge: text({ length: 255 }),
})
export type SelectUsers = InferSelectModel<typeof users>

export const authenticators = sqliteTable(
  'authenticators',
  {
    id: id,
    credentialId: text().notNull(),
    credentialPublicKey: text().notNull(),
    counter: blob({ mode: 'bigint' }).notNull(),
    credentialDeviceType: text().notNull(),
    credentialBackedUp: int({ mode: 'boolean' }).notNull(),
    userId: text().notNull(),
    transports: text({ mode: 'json' }).$type<AuthenticatorTransport[]>(),
  },
  (table) => [index('index_authenticators_on_user_id').on(table.userId)],
)

export const co2Producers = sqliteTable(
  'co2_producers',
  {
    id: id,
    title: text({ length: 255 }).notNull(),
    description: text(),
    categoryId: text().notNull(),
    image: text({ length: 255 }),
    userId: text().notNull(),
    unit: units.notNull(),
    singleConsumptionFrom: real().notNull(),
    singleConsumptionTo: real().notNull(),
    singleConsumptionAverage: real().notNull(),
    timesPerYearFrom: real().notNull(),
    timesPerYearTo: real().notNull(),
    timesPerYearAverage: real().notNull(),
    slug: text('slug', { length: 255 }).unique().notNull(),
  },
  (table) => [index('category_id').on(table.categoryId)],
)

export const links = sqliteTable(
  'links',
  {
    id: id,
    sourcesId: text().notNull(),
    name: text({ length: 191 }).notNull(),
    mediaType: text({ length: 191 }).notNull(),
    url: text({ length: 2000 }).notNull(),
  },
  (table) => [index('links_sources_id_idx').on(table.sourcesId)],
)

export const sourcedCo2Amounts = sqliteTable(
  'sourced_co2_amounts',
  {
    id: id,
    co2ProducerId: text().notNull(),
    sourceId: text().notNull(),
    gCo2E: real('g_co2e').notNull(),
    per: real().notNull(),
    quote: text(),
    description: text().notNull(),
    userId: text().notNull(),
    sourceCo2EAmount: real('source_co2e_amount'),
    sourceCo2EUnit: text('source_co2e_unit', { length: 255 }),
  },
  (table) => [
    index('sourced_co2_amounts_source_id_co2_producer_id_idx').on(
      table.co2ProducerId,
      table.sourceId,
    ),
  ],
)
export type SelectSourcedCo2Amounts = InferSelectModel<typeof sourcedCo2Amounts>

export const sources = sqliteTable(
  'sources',
  {
    id: id,
    co2ProducerId: text().notNull(),
    region: text({ length: 255 }),
    year: int(),
    userId: text().notNull(),
    name: text({ length: 255 }).notNull(),
  },
  (table) => [
    index('index_co2_producer_id').on(table.co2ProducerId),
    index('index_user_id').on(table.userId),
  ],
)

export const co2Average = sqliteView('co2_average', {
  id: id,
  title: text('title', { length: 255 }).notNull(),
  description: text('description'),
  slug: text('slug', { length: 255 }).notNull(),
  unit: units.notNull(),
  avgPerYear: real('avg_per_year'),
  avgPerUnit: real('avg_per_unit'),
  singleConsumptionFrom: real('single_consumption_from').notNull(),
  singleConsumptionTo: real('single_consumption_to').notNull(),
  singleConsumptionAverage: real('single_consumption_average').notNull(),
  timesPerYearFrom: real('times_per_year_from').notNull(),
  timesPerYearTo: real('times_per_year_to').notNull(),
  timesPerYearAverage: real('times_per_year_average').notNull(),
}).as(sql`SELECT co2.id,
    co2.title,
    co2.description,
    co2.slug,
    co2.unit,
    (co2.single_consumption_average * co2.times_per_year_average * avg(sourced_co2_amounts.g_co2e)) AS avg_per_year,
    avg(sourced_co2_amounts.g_co2e) AS avg_per_unit,
    co2.single_consumption_from,
    co2.single_consumption_to,
    co2.single_consumption_average,
    co2.times_per_year_from,
    co2.times_per_year_to,
    co2.times_per_year_average
   FROM co2_producers co2
     JOIN sourced_co2_amounts ON co2.id = sourced_co2_amounts.co2_producer_id
  GROUP BY sourced_co2_amounts.co2_producer_id, co2.id, co2.title, co2.description, co2.slug, co2.unit, co2.single_consumption_to, co2.single_consumption_from, co2.single_consumption_average, co2.times_per_year_from, co2.times_per_year_to, co2.times_per_year_average;`)

type Co2AverageFields = typeof co2Average._.selectedFields

export type Co2Average = {
  [Key in keyof Co2AverageFields]: Co2AverageFields[Key]['_']['notNull'] extends true
    ? Co2AverageFields[Key]['_']['data']
    : Co2AverageFields[Key]['_']['data'] | null
}

export const userRelations = relations(users, ({ many }) => ({
  authenticators: many(authenticators),
}))

export const authenticatorRelations = relations(authenticators, ({ one }) => ({
  users: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}))
