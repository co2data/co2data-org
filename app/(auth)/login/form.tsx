'use client'

import { AuthError } from '@/adapter/pass-key'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { startAuthentication } from '@simplewebauthn/browser'
import type { AuthenticationResponseJSON } from '@simplewebauthn/types'
import { pipe } from 'effect/Function'
import { valueTags } from 'effect/Match'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { MissingUserName } from '../errors'
import { generateLoginOptions, verifyLogin } from '../server-action'
import Warning from '../warning'

const onLogin = async (prevState: unknown, formData: FormData) => {
  const username = formData.get('username')
  if (!username) {
    return { _tag: 'Left', left: new MissingUserName() } as const
  }
  const resp = await generateLoginOptions(username.toString())

  if (resp._tag === 'Left') {
    return resp
  }

  let asseResp: AuthenticationResponseJSON
  try {
    asseResp = await startAuthentication({ optionsJSON: resp.right })
  } catch (error) {
    console.error('Error at starting authentication:', error)
    return {
      _tag: 'Left',
      left: new AuthError({ cause: `StartAuthenticationFailed: ${error}` }),
    } as const
  }

  const verificationJSON = await verifyLogin({
    ...asseResp,
    username: username.toString(),
  })

  return verificationJSON
}

let toastId: number | string

export default function Form(props: {
  children: React.ReactNode
  submit: React.ReactNode
}) {
  const [state, formAction] = useActionState(onLogin, undefined)

  if (state && state._tag === 'Right') {
    toastId = toast(
      <>
        <Check
          className="inline-block text-green-700"
          size={30}
          strokeWidth={3}
        />{' '}
        Login successful!
      </>,
      { closeButton: true, duration: 5000, id: toastId },
    )
    redirect('/')
  }

  return (
    <form action={formAction}>
      <CardContent>
        {props.children}
        {state && state._tag === 'Left' && (
          <Warning className="mt-4">
            {pipe(
              state.left,
              valueTags({
                MissingUserNameError: (cause) =>
                  'User name is empty. Please insert your user name.',
                NoUserFoundError: (cause) => (
                  <>
                    User not found. Please sign up first.{' '}
                    <Button asChild className="ml-2">
                      <Link href={'/sign-up'} className="no-underline!">
                        Sign up
                      </Link>
                    </Button>
                  </>
                ),
                AuthError: () => 'Uuups, that did not work. Try again later',
              }),
            )}
          </Warning>
        )}
      </CardContent>
      {props.submit}
    </form>
  )
}
