import { Co2Average } from '.'

export function makeCo2Average() {
  return {
    id: 'id',
    title: 'Pork',
    slug: 'test',
    unit: 'kilogram',
    avgPerYear: 500000,
    avgPerUnit: 30000,
    singleConsumptionFrom: 0,
    singleConsumptionAverage: 4,
    singleConsumptionTo: 100,
    timesPerYearFrom: 0,
    timesPerYearAverage: 5,
    timesPerYearTo: 20,
  } satisfies Co2Average
}
