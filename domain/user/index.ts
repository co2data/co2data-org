import type { AuthenticatorTransport } from '@simplewebauthn/types'
import { Brand, type Option } from 'effect'
import type { CredentialDeviceType } from 'node_modules/@simplewebauthn/server/esm/deps'

export { SourceRepository } from '@/domain/source/repository'
export type User = {
  id: string
  username: string
  currentChallenge: Option.Option<string>
  authenticators: Array<Authenticator>
}

type Base64String = Brand.Branded<string, 'base64String'>
export const Base64String = Brand.nominal<Base64String>()

export type Authenticator = {
  credentialID: Base64String
  credentialPublicKey: string
  counter: number
  credentialDeviceType: CredentialDeviceType
  credentialBackedUp: boolean
  transports?: AuthenticatorTransport[]
}
