'use client'
import { startRegistration } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { exhaustive, value, when, whenOr } from 'effect/Match'
import { useFormState } from 'react-dom'
import { generateSignUpOptions, verifySignUp } from '../server-action'

const onSignUp = async () => {
  const resp = await generateSignUpOptions()

  if (resp._tag === 'Left') {
    return resp
  }

  let attResp
  try {
    attResp = await startRegistration(resp.right)
  } catch (error: unknown) {
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'InvalidStateError'
    ) {
      console.log(
        'Error: Authenticator was probably already registered by user'
      )
      return { _tag: 'Left', left: 'AlreadyRegisteredError' } as const
    } else {
      console.log(`Error: ${error}`)
      return { _tag: 'Left', left: 'OtherError', error: error } as const
    }
  }

  const verification = await verifySignUp(attResp)

  return verification
}

export default function Login() {
  const [state, formAction] = useFormState(onSignUp, undefined)

  return (
    <section>
      <h1>Sign Up</h1>
      <button formAction={formAction}>Sign up</button>
      {state &&
        state._tag === 'Left' &&
        pipe(
          value(state.left),
          when('NoUserFoundError', (_) => <p>No User found</p>),
          when('AlreadyRegisteredError', (_) => <p>Already registered.</p>),
          whenOr(
            'DbError',
            'NotVerifiedError',
            'NoChallengeOnUserError',
            'CouldNotSetChallengeError',
            'UnknownException',
            'AuthError',
            'OtherError',
            (_) => <p>Upps, that did not work. Try again later.</p>
          ),
          exhaustive
        )}
    </section>
  )
}
