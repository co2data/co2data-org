'use client'
import { startRegistration } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { exhaustive, value, when, whenOr } from 'effect/Match'
import { Simplify } from 'effect/Types'
import { useState } from 'react'
import { generateSignUpOptions, verifySignUp } from '../server-action'

export default function Login() {
  type SignUpOptionsResult = Simplify<
    Awaited<ReturnType<typeof generateSignUpOptions>>
  >
  type VerifySignUpResult = Simplify<Awaited<ReturnType<typeof verifySignUp>>>
  type Errors<T> = Extract<T, { _tag: 'Left' }>

  type ErrorTypes =
    | Errors<SignUpOptionsResult>['left']
    | Errors<VerifySignUpResult>['left']

  const [error, setError] = useState<ErrorTypes>()
  const onLogin = async () => {
    const resp = await generateSignUpOptions()

    if (resp._tag === 'Left') {
      setError(resp.left)
      return
    }

    let attResp
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startRegistration(resp.right)
    } catch (error: unknown) {
      // Some basic error handling
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'InvalidStateError'
      ) {
        console.log(
          'Error: Authenticator was probably already registered by user'
        )
      } else {
        console.log(`Error: ${error}`)
      }

      throw error
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyRegistrationResponse()
    const verification = await verifySignUp(attResp)

    if (verification._tag === 'Left') {
      console.log('verification error', verification.left)
      setError(verification.left)
      return
    }

    // Show UI appropriate for the `verified` status
    if (verification && verification.right.verified) {
      console.log('Verification success!')
    } else {
      console.log(
        `Oh no, something went wrong! Response: <pre>${JSON.stringify(
          verification
        )}</pre>`
      )
    }
  }

  return (
    <section>
      <h1>Sign Up</h1>
      <button onClick={onLogin}>Sign up</button>
      {error &&
        pipe(
          value(error),
          when('NoUserFoundError', (_) => <p>No User found</p>),
          whenOr(
            'DbError',
            'NotVerifiedError',
            'NoChallengeOnUserError',
            'CouldNotSetChallengeError',
            'UnknownException',
            'AuthError',
            (_) => <p>Upps, that did not work. Try again later.</p>
          ),
          exhaustive
        )}
    </section>
  )
}
