'use client'
import { AuthError } from '@/adapter/pass-key'
import { CardContent } from '@/components/ui/card'
import { startRegistration } from '@simplewebauthn/browser'
import type { RegistrationResponseJSON } from '@simplewebauthn/types'
import { pipe } from 'effect/Function'
import { valueTags } from 'effect/Match'
import Link from 'next/link'
import type React from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { AlreadyRegistered, MissingUserName } from '../errors'
import { generateSignUpOptions, verifySignUp } from '../server-action'
import Warning from '../warning'

const onSignUp = async (prevState: unknown, formData: FormData) => {
  const username = formData.get('username')
  if (!username) {
    return { _tag: 'Left', left: new MissingUserName() } as const
  }

  const resp = await generateSignUpOptions(username.toString())

  if (resp._tag === 'Left') {
    return resp
  }

  let attResp: RegistrationResponseJSON
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
    }
    return { _tag: 'Left', left: new AuthError({ cause: error }) } as const
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

  console.log('state', state)

  return (
    <form action={formAction}>
      <CardContent className="grid gap-4">
        {props.children}
        {state && state._tag === 'Left' && (
          <Warning>
            {pipe(
              state.left,
              valueTags({
                AlreadyRegisteredError: (_) => (
                  <>
                    A user with this name already exists. Choose a different
                    name or <Link href={'/login'}>login</Link> instead.
                  </>
                ),
                AuthError: (_) => {
                  console.error('Auth error', _)
                  return 'Ooops, that did not work. Try again later.'
                },
                MissingUserNameError: (_) => 'User name is missing.',
              }),
            )}
          </Warning>
        )}
      </CardContent>

      {props.submit}
    </form>
  )
}
