import type {
  AuthenticatorTransport,
  CredentialDeviceType,
} from '@simplewebauthn/types'
import { Brand, type Option } from 'effect'

export { UserRepository } from '@/domain/user/repository'
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
