import { Authenticator } from '@/domain/user'
import { BaseError } from '@/lib/types'
import { base64UrlStringToUInt8Array } from '@/lib/utils'
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'
import { Context, Data, Effect, Layer } from 'effect'
import { mock } from 'testtriple'
import { rpID, rpName, rpOrigin } from './relying-partner'

export class AuthError extends Data.TaggedError('AuthError')<BaseError> {}

const make = Effect.gen(function* ($) {
  return {
    generateAuthenticationOptions: (props: {
      userAuthenticators: Authenticator[]
    }) =>
      Effect.tryPromise({
        try: () =>
          generateAuthenticationOptions({
            rpID,
            // Require users to use a previously-registered authenticator
            allowCredentials: props.userAuthenticators.map((authenticator) => ({
              id: base64UrlStringToUInt8Array(authenticator.credentialID),
              type: 'public-key',
              transports: authenticator.transports,
            })),
            userVerification: 'preferred',
          }),
        catch: (error) => new AuthError({ cause: error }),
      }).pipe(Effect.withSpan('generateAuthenticationOptions')),

    verifyAuthenticationResponse: (props: {
      body: AuthenticationResponseJSON
      expectedChallenge: string
      authenticator: Authenticator
    }) =>
      Effect.tryPromise({
        try: () =>
          verifyAuthenticationResponse({
            response: props.body,
            expectedChallenge: props.expectedChallenge,
            expectedOrigin: rpOrigin,
            expectedRPID: rpID,
            authenticator: {
              ...props.authenticator,
              credentialID: base64UrlStringToUInt8Array(
                props.authenticator.credentialID
              ),
              credentialPublicKey: base64UrlStringToUInt8Array(
                props.authenticator.credentialPublicKey
              ),
            },
          }),
        catch: (error) => new AuthError({ cause: error }),
      }).pipe(Effect.withSpan('verifyAuthenticationResponse')),

    generateRegistrationOptions: (props: {
      userId: string
      userName: string
    }) =>
      Effect.tryPromise({
        try: () =>
          generateRegistrationOptions({
            rpID,
            rpName: rpName,
            userID: props.userId,
            userName: props.userName,
          }),
        catch: (error) => new AuthError({ cause: error }),
      }).pipe(Effect.withSpan('generateRegistrationOptions')),

    verifyRegistrationResponse: (props: {
      responseBody: RegistrationResponseJSON
      currentChallenge: string
    }) =>
      Effect.tryPromise(() =>
        verifyRegistrationResponse({
          response: props.responseBody,
          expectedChallenge: props.currentChallenge,
          expectedOrigin: rpOrigin,
          expectedRPID: rpID,
        })
      ).pipe(Effect.withSpan('verifyRegistrationResponse')),
  }
})

export interface PassKey {
  readonly _: unique symbol
}

export const PassKey = Context.Tag<
  PassKey,
  Effect.Effect.Success<typeof make>
>()

export const PassKeyLive = Layer.effect(PassKey, make)

export const PassKeyTest = Layer.succeed(
  PassKey,
  PassKey.of(
    mock({
      generateAuthenticationOptions: () =>
        Effect.succeed({ json: 'hi', challenge: 'challenge' }),
    })
  )
)
