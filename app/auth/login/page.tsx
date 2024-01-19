'use client'
import { Button } from '@/components/ui/button'
import { startAuthentication } from '@simplewebauthn/browser'
import { generateLoginOptions, verifyLogin } from '../server-action'

export default function Login() {
  const onLogin = async (formData: FormData) => {
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
      console.log(
        `Oh no, something went wrong! Response: <pre>${JSON.stringify(
          verificationJSON
        )}</pre>`
      )
      return
    }

    if (verificationJSON.right.verified) {
      // Show UI appropriate for the `verified` status
      console.log('Success!', verificationJSON)
    }
  }

  return (
    <section>
      <h1>Login</h1>
      <form action={onLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" id="username" />
        <Button>Login</Button>
      </form>
    </section>
  )
}
