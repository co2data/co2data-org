'use client'

import { startAuthentication } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { tag, discriminator, exhaustive, value } from 'effect/Match'
import { MissingUserName, StartAuthenticationFailed } from '../errors'
import { generateLoginOptions, verifyLogin } from '../server-action'
import { useFormState } from 'react-dom'
import { CardContent } from '@/components/ui/card'
import Warning from '../warning'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

  return (
    <form action={formAction}>
      <CardContent>
        {props.children}
        {state && state._tag === 'Right' && <p>Login successful!</p>}
        {state && state._tag === 'Left' && (
          <Warning className="mt-4">
            {pipe(
              value(state.left),
              tag(
                'MissingUserNameError',
                (_) => 'User name is empty. Please insert your user name.'
              ),
              tag('NotVerifiedError', (_) => 'Not verified'),
              tag('NoUserFoundError', (_) => (
                <>
                  User not found. Please sign up first.{' '}
                  <Button asChild className="ml-2">
                    <Link href={'/auth/sign-up'} className="!no-underline">
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
                (_) => `Authentication not possible`
              ),
              discriminator('_tag')(
                'DbError',
                'CouldNotSetChallengeError',
                (_) => 'Try again later.'
              ),

              exhaustive
            )}
          </Warning>
        )}
      </CardContent>
      {props.submit}
    </form>
  )
}
