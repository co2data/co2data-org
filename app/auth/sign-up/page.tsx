'use client'
import { startRegistration } from '@simplewebauthn/browser'

export default function Login() {
  const onLogin = async () => {
    const resp = await fetch('/auth/sign-up/generate-registration-options')

    let attResp
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startRegistration(await resp.json())
    } catch (error: unknown) {
      // Some basic error handling
      if (
        error &&
        typeof error === 'object' &&
        'name' in error &&
        error.name === 'InvalidStateError'
      ) {
        console.log(
          'Error: Authenticator was probably already registered by user'
        )
      } else {
        console.log(`Error: ${error}`)
      }

      throw error
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyRegistrationResponse()
    const verificationResp = await fetch('/auth/sign-up/verify-registration', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(attResp),
    })

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json()

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
      console.log('Verification success!')
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
      <button onClick={onLogin}>Login</button>
    </section>
  )
}
