import type { AuthenticatorTransport } from '@simplewebauthn/types'
import type { Option } from 'effect'
import type { CredentialDeviceType } from 'node_modules/@simplewebauthn/server/esm/deps'

export { SourceRepository } from '@/domain/source/repository'
export type User = {
  id: string
  username: string
  currentChallenge: Option.Option<string>
  authenticators: Array<Authenticator>
}

export type Authenticator = {
  credentialID: string
  credentialPublicKey: string
  counter: number
  credentialDeviceType: CredentialDeviceType
  credentialBackedUp: boolean
  transports?: AuthenticatorTransport[]
}
