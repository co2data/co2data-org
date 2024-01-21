'use client'
import { Button } from '@/components/ui/button'
import { startAuthentication } from '@simplewebauthn/browser'
import { generateLoginOptions, verifyLogin } from '../server-action'
import { useFormState, useFormStatus } from 'react-dom'

const onLogin = async (prevState: any, formData: FormData) => {
  const username = formData.get('username')
  if (!username) {
    return
  }
  // GET authentication options from the endpoint that calls
  // @simplewebauthn/server -> generateAuthenticationOptions()
  const resp = await generateLoginOptions(username.toString())

  if (resp._tag === 'Left') {
    console.error('login options error', resp.left)
    return
  }

  let asseResp
  try {
    // Pass the options to the authenticator and wait for a response
    asseResp = await startAuthentication(resp.right)
  } catch (error) {
    console.error(error)
    // Some basic error handling
    return Response.json(error, { status: 500 })
  }

  // POST the response to the endpoint that calls
  // @simplewebauthn/server -> verifyAuthenticationResponse()
  const verificationJSON = await verifyLogin({
    ...asseResp,
    username: username.toString(),
  })

  if (verificationJSON._tag === 'Left') {
    console.log('Error!', verificationJSON)
    return { kind: 'error', error: verificationJSON.left } as const
  }

  if (verificationJSON.right.verified) {
    // Show UI appropriate for the `verified` status
    console.log('Success!', verificationJSON)
    return { kind: 'success', value: verificationJSON.right } as const
  }

  return { kind: 'other' } as const
}
export default function Login() {
  const [state, formAction] = useFormState(onLogin, { kind: 'other' })
  const { pending } = useFormStatus()

  if (state instanceof Response) {
    return <p>State is Response</p>
  }

  return (
    <section>
      <h1>Login</h1>
      <form action={formAction}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <Button disabled={pending}>Login</Button>
        {state && state.kind === 'error' && <p>Error: {state.error}</p>}
        {state && state.kind === 'success' && <p>Login successful!</p>}
        {state && state.kind === 'other' && <p>Other result...</p>}
      </form>
    </section>
  )
}
