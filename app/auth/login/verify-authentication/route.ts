import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { notFound } from 'next/navigation'
import { NextRequest } from 'next/server'
import { rpID, rpOrigin } from '../../relying-partner'
import { uInt8ArrayToURLBase64 } from '../../users/route'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // (Pseudocode) Retrieve the logged-in user
  const user = globalThis.users?.get('phi.sch@hotmail.ch') ?? notFound()
  // (Pseudocode) Get `options.challenge` that was saved above
  const expectedChallenge = user.currentChallenge ?? notFound()
  // (Pseudocode} Retrieve an authenticator from the DB that
  // should match the `id` in the returned credential
  const authenticator = user.authenticators.find((authenticator) => {
    const cId = uInt8ArrayToURLBase64(authenticator.credentialID)
    console.log('cId:', cId, body.id)

    return cId === body.id
  })

  console.log('verify with', body, authenticator, user)

  if (!authenticator) {
    return Response.json(
      `Could not find authenticator ${body.id} for user ${user.id}`,
      { status: 401 }
    )
  }

  let verification
  try {
    verification = await verifyAuthenticationResponse({
      response: body,
      expectedChallenge,
      expectedOrigin: rpOrigin,
      expectedRPID: rpID,
      authenticator,
    })
  } catch (error) {
    console.error(error)
    return Response.json(error, { status: 400 })
  }

  const { verified } = verification

  if (verified) {
    const { authenticationInfo } = verification
    const { newCounter } = authenticationInfo
    authenticator.counter = newCounter
    return Response.json({ verified })
  } else {
    return Response.json('not verified', { status: 401 })
  }
}
