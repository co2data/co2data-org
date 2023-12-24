import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'

import { rpID, rpName } from '../../relying-partner'
import { notFound } from 'next/navigation'

export async function GET() {
  const user = globalThis.users?.get('phi.sch@hotmail.ch') ?? notFound()

  const options = await generateRegistrationOptions({
    rpID,
    rpName,
    userID: user.id,
    userName: user.username,
  })

  console.log('Challenge', options.challenge)

  user.currentChallenge = options.challenge

  return Response.json(options)
}
