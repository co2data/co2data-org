'use client'
import { Button } from '@/components/ui/button'
import { startAuthentication } from '@simplewebauthn/browser'

export default function Login() {
  const onLogin = async () => {
    // GET authentication options from the endpoint that calls
    // @simplewebauthn/server -> generateAuthenticationOptions()
    const resp = await fetch('/auth/login/generate-authentication-options')

    let asseResp
    try {
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication(await resp.json())
    } catch (error) {
      // Some basic error handling
      return Response.json(error, { status: 500 })
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await fetch('/auth/login/verify-authentication', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asseResp),
    })

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json()

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
      console.log('Success!', verificationJSON)
    } else {
      console.log(
        `Oh no, something went wrong! Response: <pre>${JSON.stringify(
          verificationJSON
        )}</pre>`
      )
    }
  }

  return (
    <section>
      <h1>Login</h1>
      <Button onClick={onLogin}>Login</Button>
    </section>
  )
}
