import { cx } from 'class-variance-authority'
import type { ClassValue } from 'class-variance-authority/dist/types'

export function cn(...inputs: ClassValue[]) {
  return cx(inputs)
}

export function raise(error: string): never {
  throw new Error(error)
}

export function format(
  value: number,
  options: { trialingZeros?: boolean; decimalPlaces?: number } = {}
) {
  const { trialingZeros = true, decimalPlaces = 3 } = options
  return trialingZeros
    ? value.toFixed(decimalPlaces)
    : parseFloat(value.toFixed(decimalPlaces))
}
