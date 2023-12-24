import { notFound } from 'next/navigation'
import { rpID } from '../../relying-partner'
import { generateAuthenticationOptions } from '@simplewebauthn/server'

export async function GET() {
  const user = globalThis.users?.get('phi.sch@hotmail.ch') ?? notFound()
  const userAuthenticators = user.authenticators

  const options = await generateAuthenticationOptions({
    rpID,
    // Require users to use a previously-registered authenticator
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: 'public-key',
      transports: authenticator.transports,
    })),
    userVerification: 'preferred',
  })

  user.currentChallenge = options.challenge

  return Response.json(options)
}
