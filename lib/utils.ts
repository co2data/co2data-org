import { cx } from 'class-variance-authority'
import type { ClassValue } from 'class-variance-authority/types'
import { LogLevel, Logger, Option, identity } from 'effect'

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

export function setLogLevelFromSearchParams(props: {
  searchParams: { logLevel?: string | undefined }
}) {
  const logLevel = props.searchParams['logLevel'] as LogLevel.Literal

  if (
    logLevel === undefined ||
    !LogLevel.allLevels.some((ll) => ll._tag === logLevel)
  ) {
    return identity
  }

  return Logger.withMinimumLogLevel(LogLevel.fromLiteral(logLevel))
}
export function mapToJSX<A>(f: (arg: A) => React.ReactNode) {
  return (item: Option.Option<A>) => item.pipe(Option.map(f), Option.getOrNull)
}
