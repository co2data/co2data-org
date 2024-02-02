'use client'
import { AuthError } from '@/adapter/pass-key'
import { CardContent } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { startRegistration } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { discriminator, exhaustive, tag, value } from 'effect/Match'
import Link from 'next/link'
import React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { AlreadyRegistered, MissingUserName } from '../errors'
import { generateSignUpOptions, verifySignUp } from '../server-action'
import Warning from '../warning'

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

  return verifySignUp({
    ...attResp,
    username: username.toString(),
  })
}

export default function Form(props: {
  children: React.ReactNode
  submit: React.ReactNode
}) {
  const [state, formAction] = useFormState(onSignUp, undefined)
  const { pending } = useFormStatus()

  return (
    <form action={formAction}>
      <CardContent className="grid gap-4">
        {props.children}
        {state && state._tag === 'Left' && (
          <Warning>
            {pipe(
              value(state.left),
              tag('MissingUserNameError', (_) => 'User name is missing.'),
              tag('NoUserFoundError', (_) => 'No User found'),
              tag('AlreadyRegisteredError', (_) => (
                <>
                  A user with this name already exists. Choose a different name
                  or <Link href={'/login'}>login</Link> instead.
                </>
              )),
              tag('AuthError', (_) => 'Error authenticating.'),
              discriminator('_tag')(
                'DbError',
                'NotVerifiedError',
                'NoChallengeOnUserError',
                'CouldNotSetChallengeError',
                'UnknownException',
                (_) => 'Upps, that did not work. Try again later.'
              ),
              exhaustive
            )}
          </Warning>
        )}
      </CardContent>

      {props.submit}
      {pending && (
        <div className="mx-8 mb-4 flex justify-center">
          <Spinner />
        </div>
      )}
    </form>
  )
}
