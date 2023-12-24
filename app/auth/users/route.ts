export function GET() {
  if (!globalThis.users) {
    return Response.json('no users')
  }
  const philip = globalThis.users.get('phi.sch@hotmail.ch')
  if (!philip) {
    return Response.json('no user phi.sch')
  }
  return Response.json({
    user: philip,
    credentialIds: philip.authenticators.map((a) => {
      const type = typeof a.credentialID
      const credentialId = a.credentialID
      const int8array = Int8Array.from(Object.values(a.credentialID))
      const utf8String = String.fromCharCode.apply(
        null,
        Array.from(credentialId)
      )
      const base64 = btoa(utf8String)
      const urlEncoded = base64
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '')
      return { type, credentialId, int8array, utf8String, base64, urlEncoded }
    }),
  })
}

export function POST() {
  if (!globalThis.users) {
    globalThis.users = new Map([
      [
        'phi.sch@hotmail.ch',
        {
          id: 'phi.sch@hotmail.ch',
          username: 'phi.sch@hotmail.ch',
          authenticators: [],
        },
      ],
    ])
    return Response.json('seeded users')
  }
  return Response.json('had users already')
}
export function uInt8ArrayToURLBase64(credentialId: Uint8Array) {
  // Convert Uint8Array to regular array
  const utf8String = String.fromCharCode.apply(null, Array.from(credentialId))
  const base64 = btoa(utf8String)
  const urlEncoded = base64
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
  return urlEncoded
}
