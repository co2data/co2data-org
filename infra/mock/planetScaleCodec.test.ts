import { expect, test } from 'vitest'
import { encode, parse } from './planetScaleCodec'

const encoded = {
  fields: [
    {
      name: 'id',
      type: 'CHAR',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'id',
      columnLength: 144,
      charset: 255,
      flags: 1,
    },
    {
      name: 'title',
      type: 'VARCHAR',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'title',
      columnLength: 1020,
      charset: 255,
      flags: 4097,
    },
    {
      name: 'slug',
      type: 'VARCHAR',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'slug',
      columnLength: 1020,
      charset: 255,
      flags: 4097,
    },
    {
      name: 'unit',
      type: 'ENUM',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'unit',
      columnLength: 36,
      charset: 255,
      flags: 4353,
    },
    {
      name: 'avg_per_year',
      type: 'DECIMAL',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'avg_per_year',
      columnLength: 18,
      charset: 63,
      decimals: 2,
      flags: 32768,
    },
    {
      name: 'avg_per_unit',
      type: 'FLOAT64',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'avg_per_unit',
      columnLength: 23,
      charset: 63,
      decimals: 31,
      flags: 32768,
    },
    {
      name: 'single_consumption_from',
      type: 'FLOAT64',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'single_consumption_from',
      columnLength: 22,
      charset: 63,
      decimals: 31,
      flags: 36865,
    },
    {
      name: 'single_consumption_to',
      type: 'FLOAT64',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'single_consumption_to',
      columnLength: 22,
      charset: 63,
      decimals: 31,
      flags: 36865,
    },
    {
      name: 'single_consumption_average',
      type: 'FLOAT64',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'single_consumption_average',
      columnLength: 22,
      charset: 63,
      decimals: 31,
      flags: 36865,
    },
    {
      name: 'times_per_year_from',
      type: 'FLOAT64',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'times_per_year_from',
      columnLength: 22,
      charset: 63,
      decimals: 31,
      flags: 36865,
    },
    {
      name: 'times_per_year_to',
      type: 'FLOAT64',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'times_per_year_to',
      columnLength: 22,
      charset: 63,
      decimals: 31,
      flags: 36865,
    },
    {
      name: 'times_per_year_average',
      type: 'FLOAT64',
      table: 'co2_average',
      orgTable: 'co2_average',
      database: 'co2data-org',
      orgName: 'times_per_year_average',
      columnLength: 22,
      charset: 63,
      decimals: 31,
      flags: 36865,
    },
  ],
  rows: [
    {
      lengths: ['36', '6', '6', '8', '9', '5', '1', '3', '4', '1', '4', '3'],
      values:
        'ZjcxZDMxNTMtMzc0Ni00NGYxLWJjMGItMGE3ZDkyNTY1ZWZlR3JhaW5zZ3JhaW5za2lsb2dyYW02NzUwMDAuMDAyNzAwMDAwLjUwLjA1MDEwMDA1MDA=',
    },
  ],
}
const decoded = [
  {
    id: 'f71d3153-3746-44f1-bc0b-0a7d92565efe',
    title: 'Grains',
    slug: 'grains',
    unit: 'kilogram',
    avg_per_year: '675000.00',
    avg_per_unit: 27000,
    single_consumption_from: 0,
    single_consumption_to: 0.5,
    single_consumption_average: 0.05,
    times_per_year_from: 0,
    times_per_year_to: 1000,
    times_per_year_average: 500,
  },
]
test('parser', () => {
  const actual = parse(encoded)
  expect(actual).toStrictEqual(decoded)
})

test.skip('encoder', () => {
  const actual = encode(decoded)
  expect(actual).toStrictEqual(encoded)
})

test('mirror', () => {
  const encodedM = encode(decoded)
  const decodedM = parse(encodedM)

  expect(decodedM).toStrictEqual(decoded)
})
