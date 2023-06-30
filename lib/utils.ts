import { cx } from 'class-variance-authority'
import type { ClassValue } from 'class-variance-authority/dist/types'

export function cn(...inputs: ClassValue[]) {
  return cx(inputs)
}
