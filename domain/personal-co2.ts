const AVG_CO2_PER_PERSON_YEAR = 6000000

export function calcCo2PerConsumption(avgPerUnit: number, consumption: number) {
  return avgPerUnit * consumption
}

export function calcCo2PerYear(times: number, co2PerConsumption: number) {
  return times * co2PerConsumption
}

export function calcFactorOfPersonYearFootprint(co2PerYear: number) {
  return co2PerYear / AVG_CO2_PER_PERSON_YEAR
}
