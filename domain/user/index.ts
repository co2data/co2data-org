import { Option } from 'effect'
import { CredentialDeviceType } from 'node_modules/@simplewebauthn/server/esm/deps'

export { SourceRepository } from '@/domain/source/repository'
export type User = {
  id: string
  email: string
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
