import { InferSelectModel, relations, sql } from 'drizzle-orm'
import {
  bigint,
  boolean,
  char,
  decimal,
  double,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  mysqlView,
  text,
  varchar,
} from 'drizzle-orm/mysql-core'

export const categories = mysqlTable('categories', {
  id: char('id', { length: 36 }).default(sql`(uuid())`).primaryKey().notNull(),
  title: text('title').notNull(),
  slug: varchar('slug', { length: 255 }).default('').notNull(),
})

export const co2Average = mysqlView('co2_average', {
  id: char('id', { length: 36 }).default(sql`(uuid())`).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  slug: varchar('slug', { length: 255 }).notNull(),
  unit: mysqlEnum('unit', [
    'kilometer',
    'hour',
    'gram',
    'meter',
    'kilogram',
    'liter',
    'minute',
  ]).notNull(),
  avgPerYear: decimal('avg_per_year', { precision: 16, scale: 2 }),
  avgPerUnit: double('avg_per_unit'),
  singleConsumptionFrom: double('single_consumption_from').notNull(),
  singleConsumptionTo: double('single_consumption_to').notNull(),
  singleConsumptionAverage: double('single_consumption_average').notNull(),
  timesPerYearFrom: double('times_per_year_from').notNull(),
  timesPerYearTo: double('times_per_year_to').notNull(),
  timesPerYearAverage: double('times_per_year_average').notNull(),
}).existing()

type Co2AverageFields = typeof co2Average._.selectedFields

export type Co2Average = {
  [Key in keyof Co2AverageFields]: Co2AverageFields[Key]['_']['notNull'] extends true
    ? Co2AverageFields[Key]['_']['data']
    : Co2AverageFields[Key]['_']['data'] | null
}

export const co2Producers = mysqlTable(
  'co2_producers',
  {
    id: char('id', { length: 36 })
      .default(sql`(uuid())`)
      .primaryKey()
      .notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    categoryId: char('category_id', { length: 36 }).notNull(),
    image: varchar('image', { length: 255 }),
    userId: char('user_id', { length: 36 }).notNull(),
    unit: mysqlEnum('unit', [
      'kilometer',
      'hour',
      'gram',
      'meter',
      'kilogram',
      'liter',
      'minute',
    ]).notNull(),
    singleConsumptionFrom: double('single_consumption_from').notNull(),
    singleConsumptionTo: double('single_consumption_to').notNull(),
    singleConsumptionAverage: double('single_consumption_average').notNull(),
    timesPerYearFrom: double('times_per_year_from').notNull(),
    timesPerYearTo: double('times_per_year_to').notNull(),
    timesPerYearAverage: double('times_per_year_average').notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
  },
  (table) => {
    return {
      categoryId: index('category_id').on(table.categoryId),
    }
  },
)

export const links = mysqlTable(
  'links',
  {
    id: char('id', { length: 36 })
      .default(sql`(uuid())`)
      .primaryKey()
      .notNull(),
    sourcesId: char('sources_id', { length: 36 }).notNull(),
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

export const sourcedCo2Amounts = mysqlTable(
  'sourced_co2_amounts',
  {
    id: char('id', { length: 36 })
      .default(sql`(uuid())`)
      .primaryKey()
      .notNull(),
    co2ProducerId: char('co2_producer_id', { length: 36 }).notNull(),
    sourceId: char('source_id', { length: 36 }).notNull(),
    gCo2E: double('g_co2e').notNull(),
    per: double('per').notNull(),
    quote: text('quote'),
    description: text('description').notNull(),
    userId: char('user_id', { length: 36 }).notNull(),
    sourceCo2EAmount: double('source_co2e_amount'),
    sourceCo2EUnit: varchar('source_co2e_unit', { length: 255 }),
  },
  (table) => {
    return {
      sourceIdCo2ProducerIdIdx: index(
        'sourced_co2_amounts_source_id_co2_producer_id_idx',
      ).on(table.sourceId, table.co2ProducerId),
    }
  },
)
export type SelectSourcedCo2Amounts = InferSelectModel<typeof sourcedCo2Amounts>
export const sources = mysqlTable(
  'sources',
  {
    id: char('id', { length: 36 })
      .default(sql`(uuid())`)
      .primaryKey()
      .notNull(),
    co2ProducerId: char('co2_producer_id', { length: 36 }).notNull(),
    region: varchar('region', { length: 255 }),
    year: int('year'),
    userId: char('user_id', { length: 36 }).notNull(),
    name: varchar('name', { length: 255 }).default('').notNull(),
  },
  (table) => {
    return {
      indexCo2Producers: index('index_co2_producers').on(table.co2ProducerId),
    }
  },
)

export const sourceRelations = relations(sources, ({ many }) => ({
  Links: many(links),
}))

export const users = mysqlTable('users', {
  id: char('id', { length: 36 }).default(sql`(uuid())`).primaryKey().notNull(),
  username: varchar('username', { length: 255 }).notNull(),
  currentChallenge: varchar('current_callenge', { length: 255 }),
})
export type SelectUsers = InferSelectModel<typeof users>

export const authenticators = mysqlTable(
  'authenticators',
  {
    credentialId: text('credential_id').notNull(),
    credentialPublicKey: text('credential_public_key').notNull(),
    counter: bigint('counter', { mode: 'bigint' }).notNull(),
    credentialDeviceType: varchar('credential_device_type', {
      length: 32,
    }).notNull(),
    credentialBackedUp: boolean('credential_backed_up').notNull(),
    userId: char('user_id', { length: 36 }).notNull(),
    transports: json('transports').$type<string[]>(),
  },
  (table) => {
    return {
      indexCredentialId: index('index_authenticators_credential_id').on(
        table.credentialId,
      ),
    }
  },
)

export const userRelations = relations(users, ({ many }) => ({
  authenticators: many(authenticators),
}))

export const authenticatorRelations = relations(authenticators, ({ one }) => ({
  users: one(users, {
    fields: [authenticators.userId],
    references: [users.id],
  }),
}))
