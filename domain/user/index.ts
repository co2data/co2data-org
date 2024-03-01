import { AuthError } from '@/adapter/pass-key'
import { BaseError } from '@/lib/types'
import { Data, Effect, Option } from 'effect'
import { CredentialDeviceType } from 'node_modules/@simplewebauthn/server/esm/deps'

export { SourceRepository } from '@/domain/source/repository'

export const writeOwn = { writeOwn: true } as const
export type WriteOwn = typeof writeOwn
export const writeAll = { writeAll: true } as const
export type WriteAll = typeof writeAll
export type Permissions = WriteOwn | WriteAll
type UnauthorizedUser = Option.Option<{ id: string; username: string }>

export const authorize = <T extends Permissions>(props: {
  user: UnauthorizedUser
  recordUserId?: string
  permission: T
}) =>
  Effect.gen(function* ($) {
    if (Option.isNone(props.user)) {
      return yield* $(new AuthError({ cause: 'User is undefined.' }))
    }
    if (
      ('writeAll' in props.permission && props.permission.writeAll) ||
      ('writeOwn' in props.permission &&
        props.permission.writeOwn &&
        props.user.value.id === props.recordUserId)
    ) {
      return props.user.value as AuthorizedUser<T>
    }
    return yield* $(new AuthError({ cause: 'User does not have permission.' }))
  })

export type User = {
  id: string
  username: string
  currentChallenge: Option.Option<string>
  authenticators: Array<Authenticator>
}
declare const phantom: unique symbol
export type AuthorizedUser<T extends Partial<Permissions>> = User & {
  // just here to make typescript happy
  [phantom]: T
}

export type Authenticator = {
  credentialID: string
  credentialPublicKey: string
  counter: number
  credentialDeviceType: CredentialDeviceType
  credentialBackedUp: boolean
  transports?: AuthenticatorTransport[]
}
