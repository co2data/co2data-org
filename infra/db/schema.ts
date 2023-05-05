import {
  char,
  decimal,
  double,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  mysqlView,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm/sql'
export const categories = mysqlTable('categories', {
  id: char('id', { length: 36 })
    .default(sql`(uuid())`)
    .primaryKey()
    .notNull(),
  title: text('title').notNull(),
  slug: varchar('slug', { length: 255 }).default('').notNull(),
})

export const co2Average = mysqlView('co2_average', {
  id: char('id', { length: 36 })
    .default(sql`(uuid())`)
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
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
  }
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
  }
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
        'sourced_co2_amounts_source_id_co2_producer_id_idx'
      ).on(table.sourceId, table.co2ProducerId),
    }
  }
)

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
  }
)

export const users = mysqlTable('users', {
  id: char('id', { length: 36 })
    .default(sql`(uuid())`)
    .primaryKey()
    .notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  lockedAt: timestamp('locked_at', { mode: 'string' }),
  failedLoginAttempts: int('failed_login_attempts').default(0).notNull(),
})