'use client'
import { AuthError } from '@/adapter/pass-key'
import { Button } from '@/components/ui/button'
import { startRegistration } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { discriminator, exhaustive, tag, value } from 'effect/Match'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { AlreadyRegistered, MissingUserName } from '../errors'
import { generateSignUpOptions, verifySignUp } from '../server-action'

const onSignUp = async (prevState: any, formData: FormData) => {
  const username = formData.get('username')
  if (!username) {
    return { _tag: 'Left', left: new MissingUserName() } as const
  }

  const resp = await generateSignUpOptions(username.toString())

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

  const verification = await verifySignUp({
    ...attResp,
    username: username.toString(),
  })

  return verification
}

export default function Login() {
  const [state, formAction] = useFormState(onSignUp, undefined)
  const { pending } = useFormStatus()
  return (
    <section>
      <h1>Sign Up</h1>
      <form action={formAction}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />

        <Button type="submit" disabled={pending}>
          Sign up
        </Button>
        {state && state._tag === 'Right' && (
          <p>
            Sign up successful! You can <Link href={'/auth/login'}>login</Link>{' '}
            now
          </p>
        )}
        {state &&
          state._tag === 'Left' &&
          pipe(
            value(state.left),
            tag('MissingUserNameError', (_) => <p>User name is missing.</p>),
            tag('NoUserFoundError', (_) => <p>No User found</p>),
            tag('AlreadyRegisteredError', (_) => (
              <p>
                A user with this name already exists. Choose a different name or{' '}
                <Link href={'/auth/login'}>login</Link> instead.
              </p>
            )),
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
      </form>
    </section>
  )
}
