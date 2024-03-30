import { AuthenticatorTransport } from '@simplewebauthn/types'
import { InferSelectModel, relations, sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  doublePrecision,
  index,
  integer,
  json,
  pgEnum,
  pgTable,
  pgView,
  text,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const units = pgEnum('units', [
  'minute',
  'liter',
  'kilogram',
  'meter',
  'gram',
  'hour',
  'kilometer',
])

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    title: text('title').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
  },
  (table) => {
    return {
      categoriesSlugKey: unique('categories_slug_key').on(table.slug),
    }
  },
)

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  currentChallenge: varchar('current_challenge', { length: 255 }),
})
export type SelectUsers = InferSelectModel<typeof users>

export const authenticators = pgTable(
  'authenticators',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    credentialId: text('credential_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: bigint('counter', { mode: 'bigint' }).notNull(),
    credentialDeviceType: varchar('credential_device_type', {
      length: 32,
    }).notNull(),
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    userId: uuid('user_id').notNull(),
    transports: json('transports').$type<AuthenticatorTransport[]>(),
  },
  (table) => {
    return {
      indexAuthenticatorsOnUserId: index('index_authenticators_on_user_id').on(
        table.userId,
      ),
    }
  },
)

export const co2Producers = pgTable(
  'co2_producers',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    categoryId: uuid('category_id').notNull(),
    image: varchar('image', { length: 255 }),
    userId: uuid('user_id').notNull(),
    unit: units('unit').notNull(),
    singleConsumptionFrom: doublePrecision('single_consumption_from').notNull(),
    singleConsumptionTo: doublePrecision('single_consumption_to').notNull(),
    singleConsumptionAverage: doublePrecision(
      'single_consumption_average',
    ).notNull(),
    timesPerYearFrom: doublePrecision('times_per_year_from').notNull(),
    timesPerYearTo: doublePrecision('times_per_year_to').notNull(),
    timesPerYearAverage: doublePrecision('times_per_year_average').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
  },
  (table) => {
    return {
      categoryId: index('category_id').on(table.categoryId),
      co2ProducersSlugKey: unique('co2_producers_slug_key').on(table.slug),
    }
  },
)

export const links = pgTable(
  'links',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    sourcesId: uuid('sources_id').notNull(),
    name: varchar('name', { length: 191 }).notNull(),
    mediaType: varchar('media_type', { length: 191 }).notNull(),
    url: varchar('url', { length: 2000 }).notNull(),
  },
  (table) => {
    return {
      sourcesIdIdx: index('links_sources_id_idx').on(table.sourcesId),
    }
  },
)

export const sourcedCo2Amounts = pgTable(
  'sourced_co2_amounts',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    co2ProducerId: uuid('co2_producer_id').notNull(),
    sourceId: uuid('source_id').notNull(),
    gCo2E: doublePrecision('g_co2e').notNull(),
    per: doublePrecision('per').notNull(),
    quote: text('quote'),
    description: text('description').notNull(),
    userId: uuid('user_id').notNull(),
    sourceCo2EAmount: doublePrecision('source_co2e_amount'),
    sourceCo2EUnit: varchar('source_co2e_unit', { length: 255 }),
  },
  (table) => {
    return {
      sourceIdCo2ProducerIdIdx: index(
        'sourced_co2_amounts_source_id_co2_producer_id_idx',
      ).on(table.co2ProducerId, table.sourceId),
    }
  },
)
export type SelectSourcedCo2Amounts = InferSelectModel<typeof sourcedCo2Amounts>

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').defaultRandom().primaryKey().notNull(),
    co2ProducerId: uuid('co2_producer_id').notNull(),
    region: varchar('region', { length: 255 }),
    year: integer('year'),
    userId: uuid('user_id').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
  },
  (table) => {
    return {
      co2ProducerIdIdx: index().on(table.co2ProducerId),
      userIdIdx: index().on(table.userId),
    }
  },
)

export const co2Average = pgView('co2_average', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  slug: varchar('slug', { length: 255 }).notNull(),
  unit: units('unit').notNull(),
  avgPerYear: doublePrecision('avg_per_year'),
  avgPerUnit: doublePrecision('avg_per_unit'),
  singleConsumptionFrom: doublePrecision('single_consumption_from').notNull(),
  singleConsumptionTo: doublePrecision('single_consumption_to').notNull(),
  singleConsumptionAverage: doublePrecision(
    'single_consumption_average',
  ).notNull(),
  timesPerYearFrom: doublePrecision('times_per_year_from').notNull(),
  timesPerYearTo: doublePrecision('times_per_year_to').notNull(),
  timesPerYearAverage: doublePrecision('times_per_year_average').notNull(),
}).existing()

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
