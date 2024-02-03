import { Context, Effect, Layer } from 'effect'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

const getSessionEffect = () =>
  Effect.tryPromise(() =>
    // @ts-ignore
    getIronSession<{ username?: string }>(cookies(), {
      password: 'Qq9zRhembX7RkTTZnwkNhZbTNrfNVXpn',
      cookieName: 'user-session',
    })
  ).pipe(Effect.orDie)

const make = Effect.gen(function* ($) {
  return {
    getSession: () =>
      getSessionEffect().pipe(
        Effect.map((session) => session.username),
        Effect.withSpan('get session')
      ),
    setSession: (username: string) => {
      return getSessionEffect().pipe(
        Effect.flatMap((session) =>
          Effect.tryPromise(() => {
            session.username = username
            return session.save()
          })
        ),
        Effect.orDie,
        Effect.withSpan('set session')
      )
    },
    deleteSession: () =>
      getSessionEffect().pipe(
        Effect.map((session) => session.destroy()),
        Effect.withSpan('deleteSession')
      ),
  }
})

export interface Session {
  readonly _: unique symbol
}

export const Session = Context.Tag<
  Session,
  Effect.Effect.Success<typeof make>
>()

export const { getSession, setSession, deleteSession } =
  Effect.serviceFunctions(Session)

export const SessionLive = Layer.effect(Session, make)
