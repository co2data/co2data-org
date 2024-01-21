'use client'
import { AuthError } from '@/adapter/pass-key'
import { startRegistration } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { discriminator, exhaustive, tag, value } from 'effect/Match'
import { useFormState } from 'react-dom'
import { AlreadyRegistered } from '../errors'
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
    console.error('Error:', error)
    if (
      error &&
      typeof error === 'object' &&
      'name' in error &&
      error.name === 'InvalidStateError'
    ) {
      return { _tag: 'Left', left: new AlreadyRegistered() } as const
    } else {
      return { _tag: 'Left', left: new AuthError({ cause: error }) } as const
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
          tag('NoUserFoundError', (_) => <p>No User found</p>),
          tag('AlreadyRegisteredError', (_) => <p>Already registered.</p>),
          tag('AuthError', (_) => <p>Error authenticating.</p>),
          discriminator('_tag')(
            'DbError',
            'NotVerifiedError',
            'NoChallengeOnUserError',
            'CouldNotSetChallengeError',
            'UnknownException',
            (_) => <p>Upps, that did not work. Try again later.</p>
          ),
          exhaustive
        )}
    </section>
  )
}
