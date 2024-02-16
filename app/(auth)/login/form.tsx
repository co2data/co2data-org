'use client'

import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import Spinner from '@/components/ui/spinner'
import { startAuthentication } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { discriminator, exhaustive, tag, value } from 'effect/Match'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { MissingUserName, StartAuthenticationFailed } from '../errors'
import { generateLoginOptions, verifyLogin } from '../server-action'
import Warning from '../warning'

const onLogin = async (prevState: any, formData: FormData) => {
  const username = formData.get('username')
  if (!username) {
    return { _tag: 'Left', left: new MissingUserName() } as const
  }
  const resp = await generateLoginOptions(username.toString())

  if (resp._tag === 'Left') {
    return resp
  }

  let asseResp
  try {
    asseResp = await startAuthentication(resp.right)
  } catch (error) {
    console.error(error)
    return { _tag: 'Left', left: new StartAuthenticationFailed() } as const
  }

  const verificationJSON = await verifyLogin({
    ...asseResp,
    username: username.toString(),
  })

  return verificationJSON
}

export default function Form(props: {
  children: React.ReactNode
  submit: React.ReactNode
}) {
  const [state, formAction] = useFormState(onLogin, undefined)
  const { pending } = useFormStatus()

  return (
    <form action={formAction}>
      <CardContent>
        {props.children}
        {state && state._tag === 'Right' && (
          <p className="mt-4 rounded border border-green-500/40 bg-green-500/20 p-4">
            <Check
              className="inline-block text-green-700"
              size={30}
              strokeWidth={3}
            />{' '}
            Login successful!
          </p>
        )}
        {state && state._tag === 'Left' && (
          <Warning className="mt-4">
            {pipe(
              value(state.left),
              tag(
                'MissingUserNameError',
                (_) => 'User name is empty. Please insert your user name.',
              ),
              tag('NotVerifiedError', (_) => 'Not verified'),
              tag('NoUserFoundError', (_) => (
                <>
                  User not found. Please sign up first.{' '}
                  <Button asChild className="ml-2">
                    <Link href={'/sign-up'} className="!no-underline">
                      Sign up
                    </Link>
                  </Button>
                </>
              )),
              discriminator('_tag')(
                'AuthError',
                'CouldNotFindAuthenticatorError',
                'NoChallengeOnUserError',
                'StartAuthenticationFailedError',
                (_) => 'Authentication not possible',
              ),
              discriminator('_tag')(
                'DbError',
                'CouldNotSetChallengeError',
                (_) => 'Try again later.',
              ),

              exhaustive,
            )}
          </Warning>
        )}
        {}
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
