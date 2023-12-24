'use client'
import { Button } from '@/components/ui/button'
import { startAuthentication } from '@simplewebauthn/browser'
import { generateLoginOptions, verifyLogin } from '../server-action'

export default function Login() {
  const onLogin = async () => {
    // GET authentication options from the endpoint that calls
    // @simplewebauthn/server -> generateAuthenticationOptions()
    const resp = await generateLoginOptions()

    let asseResp
    try {
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication(resp)
    } catch (error) {
      // Some basic error handling
      return Response.json(error, { status: 500 })
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationJSON = await verifyLogin(asseResp)

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
