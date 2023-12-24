'use server'

import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server'
import { notFound } from 'next/navigation'
import { rpID, rpName, rpOrigin } from './relying-partner'
import { uInt8ArrayToURLBase64 } from './users/route'

export async function verifyLogin(body: {
  id: string
  rawId: string
  response: any
  clientExtensionResults: any
  type: any
}) {
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
    throw `Could not find authenticator ${body.id} for user ${user.id}`
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
    throw error
  }

  const { verified } = verification

  if (verified) {
    const { authenticationInfo } = verification
    const { newCounter } = authenticationInfo
    authenticator.counter = newCounter
    return { verified }
  } else {
    throw 'not verified'
  }
}

export async function generateLoginOptions() {
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

  return options
}

export async function generateSignUpOptions() {
  const user = globalThis.users?.get('phi.sch@hotmail.ch') ?? notFound()

  const options = await generateRegistrationOptions({
    rpID,
    rpName,
    userID: user.id,
    userName: user.username,
  })

  console.log('Challenge', options.challenge)

  user.currentChallenge = options.challenge

  return options
}

export async function verifySignUp(body: any) {
  const user = globalThis.users?.get('phi.sch@hotmail.ch') ?? notFound()
  const { currentChallenge } = user ?? {}
  if (!currentChallenge) {
    throw 'no user with challenge'
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
    throw error
  }

  const { verified, registrationInfo } = verification

  if (verified && registrationInfo) {
    user.authenticators = [registrationInfo]
    console.log('registrationInfo', registrationInfo)

    return { verified }
  } else {
    throw 'Not verified'
  }
}
