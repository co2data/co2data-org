import type { Authenticator } from '@/domain/user'
import type { BaseError } from '@/lib/types'
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { isoBase64URL, isoUint8Array } from '@simplewebauthn/server/helpers'
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialUserEntityJSON,
  RegistrationResponseJSON,
} from '@simplewebauthn/types'
import { Data, Effect, Layer } from 'effect'
import { mock } from 'testtriple'
import { rpID, rpName, rpOrigin } from './relying-partner'

export class AuthError extends Data.TaggedError('AuthError')<BaseError> {}

const make = () => {
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
              id: authenticator.credentialID,
              type: 'public-key',
              transports: authenticator.transports ?? [],
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
              credentialID: props.authenticator.credentialID,
              credentialPublicKey: isoBase64URL.toBuffer(
                props.authenticator.credentialPublicKey,
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
            userID: isoUint8Array.fromUTF8String(props.userId),
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
        }),
      ).pipe(Effect.withSpan('verifyRegistrationResponse')),
  }
}

const makeTest = mock<typeof make>(() => {
  return {
    generateAuthenticationOptions: () =>
      Effect.succeed({ json: 'hi', challenge: 'challenge' }),
    generateRegistrationOptions: (props: {
      userId: string
      userName: string
    }) =>
      Effect.succeed({
        challenge: 'challenge',
        user: {
          displayName: props.userName,
          id: props.userId,
          name: props.userName,
        } satisfies PublicKeyCredentialUserEntityJSON,
      }),
  }
})

export class PassKey extends Effect.Tag('@services/PassKey')<
  PassKey,
  ReturnType<typeof make>
>() {
  static Live = Layer.succeed(this, make())
  static Test = Layer.succeed(this, makeTest())
}
