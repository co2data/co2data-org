import { cx } from 'class-variance-authority'
import type { ClassValue } from 'class-variance-authority/types'
import { LogLevel, Logger, Option, identity } from 'effect'
import { dual } from 'effect/Function'

export function cn(...inputs: ClassValue[]) {
  return cx(inputs)
}

export function raise(error: string): never {
  throw new Error(error)
}

export function format(
  value: number,
  options: { trialingZeros?: boolean; decimalPlaces?: number } = {},
) {
  const { trialingZeros = true, decimalPlaces = 3 } = options
  return trialingZeros
    ? value.toFixed(decimalPlaces)
    : Number.parseFloat(value.toFixed(decimalPlaces))
}

export function setLogLevelFromSearchParams(searchParams: {
  logLevel?: string | undefined
}) {
  const logLevel = searchParams.logLevel as LogLevel.Literal

  if (
    logLevel === undefined ||
    !LogLevel.allLevels.some((ll) => ll._tag === logLevel)
  ) {
    return identity
  }

  return Logger.withMinimumLogLevel(LogLevel.fromLiteral(logLevel))
}

export const mapGetOrNull: {
  <T, R>(onSome: (arg: T) => R): (option: Option.Option<T>) => R | null
  <T, R>(option: Option.Option<T>, onSome: (arg: T) => R): R | null
} = dual(2, <T, R>(option: Option.Option<T>, onSome: (arg: T) => R): R | null =>
  Option.map(option, onSome).pipe(Option.getOrNull),
)

export function base64UrlStringToUInt8Array(base64String: string) {
  const base64 = base64String.replace(/-/g, '+').replace(/_/g, '/')
  const padLength = (4 - (base64.length % 4)) % 4
  const padded = base64.padEnd(base64.length + padLength, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function uInt8ArrayToUrlBase64(credentialId: Uint8Array) {
  // Convert Uint8Array to regular array
  const utf8String = String.fromCharCode.apply(null, Array.from(credentialId))
  const base64 = btoa(utf8String)
  const urlEncoded = base64
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
  return urlEncoded
}
