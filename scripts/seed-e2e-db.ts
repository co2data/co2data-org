#!/usr/bin/env tsx
/**
 * Seed script for E2E tests
 * Seeds a SQLite database with minimal test data
 */

import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import * as schema from '../adapter/db/schema'

const DB_URL = process.env.DB_URL || 'file:./e2e-test.db'

async function seed() {
  console.log('🌱 Seeding E2E database...')

  const db = drizzle(DB_URL, {
    schema,
    casing: 'snake_case',
  })

  // Run migrations
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: 'drizzle' })

  // Create a test user
  const [user] = await db
    .insert(schema.users)
    .values({
      username: 'e2e-test-user',
    })
    .returning()

  if (!user) throw new Error('Failed to create user')
  console.log(`Created user: ${user.username}`)

  // Create a test category
  const [category] = await db
    .insert(schema.categories)
    .values({
      title: 'Food',
      slug: 'food',
    })
    .returning()

  if (!category) throw new Error('Failed to create category')
  console.log(`Created category: ${category.title}`)

  // Create test CO2 producer (Pork - referenced in E2E tests)
  const [pork] = await db
    .insert(schema.co2Producers)
    .values({
      title: 'Pork',
      slug: 'pork',
      description: 'Pork meat production',
      categoryId: category.id,
      userId: user.id,
      unit: 'kilogram',
      singleConsumptionFrom: 0.1,
      singleConsumptionTo: 0.3,
      singleConsumptionAverage: 0.2,
      timesPerYearFrom: 50,
      timesPerYearTo: 150,
      timesPerYearAverage: 100,
    })
    .returning()

  if (!pork) throw new Error('Failed to create CO2 producer')
  console.log(`Created CO2 producer: ${pork.title}`)

  // Create a source for the pork data
  const [source] = await db
    .insert(schema.sources)
    .values({
      co2ProducerId: pork.id,
      name: 'Test Source',
      region: 'Global',
      year: 2024,
      userId: user.id,
    })
    .returning()

  if (!source) throw new Error('Failed to create source')
  console.log(`Created source: ${source.name}`)

  // Add CO2 amount data
  await db.insert(schema.sourcedCo2Amounts).values({
    co2ProducerId: pork.id,
    sourceId: source.id,
    gCo2E: 7200, // 7.2 kg CO2e per kg of pork
    per: 1,
    description: 'Average CO2 emissions for pork production',
    userId: user.id,
    sourceCo2EAmount: 7.2,
    sourceCo2EUnit: 'kilogram',
  })

  console.log('✅ E2E database seeded successfully!')
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error)
  process.exit(1)
})
