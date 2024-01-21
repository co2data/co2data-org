'use client'
import { Button } from '@/components/ui/button'
import { startAuthentication } from '@simplewebauthn/browser'
import { pipe } from 'effect/Function'
import { discriminator, exhaustive, tag, value } from 'effect/Match'
import { useFormState, useFormStatus } from 'react-dom'
import { MissingUserName, StartAuthenticationFailed } from '../errors'
import { generateLoginOptions, verifyLogin } from '../server-action'

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
export default function Login() {
  const [state, formAction] = useFormState(onLogin, undefined)
  const { pending } = useFormStatus()

  return (
    <section>
      <h1>Login</h1>
      <form action={formAction}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <Button disabled={pending}>Login</Button>
        {state && state._tag === 'Right' && <p>Login successful!</p>}
        {state && state._tag === 'Left' && (
          <p>
            Error:{' '}
            {pipe(
              value(state.left),
              tag(
                'MissingUserNameError',
                (_) => 'User name is empty. Please insert your user name.'
              ),
              tag('NotVerifiedError', (_) => 'Not verified'),
              tag(
                'NoUserFoundError',
                (_) => 'User not found. Please register first.'
              ),
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
          </p>
        )}
      </form>
    </section>
  )
}
