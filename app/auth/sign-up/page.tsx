'use client'
import { startRegistration } from '@simplewebauthn/browser'
import { generateSignUpOptions, verifySignUp } from '../server-action'

export default function Login() {
  const onLogin = async () => {
    const resp = await generateSignUpOptions()

    let attResp
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startRegistration(resp)
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
    const verificationJSON = await verifySignUp(attResp)

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
      <h1>Sign Up</h1>
      <button onClick={onLogin}>Sign up</button>
    </section>
  )
}
