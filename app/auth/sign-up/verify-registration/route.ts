import { verifyRegistrationResponse } from '@simplewebauthn/server'
import { NextRequest } from 'next/server'
import { rpID, rpOrigin } from '../../relying-partner'
import { notFound } from 'next/navigation'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const user = globalThis.users?.get('phi.sch@hotmail.ch') ?? notFound()
  const { currentChallenge } = user ?? {}
  if (!currentChallenge) {
    return Response.json('no user with challenge', { status: 500 })
  }

  console.log('verifyRegistration', body, currentChallenge)

  let verification
  try {
    verification = await verifyRegistrationResponse({
      response: body,
      expectedChallenge: currentChallenge,
      expectedOrigin: rpOrigin,
      expectedRPID: rpID,
    })
  } catch (error) {
    console.error(error)
    return Response.json(error, { status: 400 })
  }

  const { verified, registrationInfo } = verification

  if (verified && registrationInfo) {
    user.authenticators = [registrationInfo]
    console.log('registrationInfo', registrationInfo)

    return Response.json({ verified })
  } else {
    return Response.json('Not verified', { status: 401 })
  }
}
