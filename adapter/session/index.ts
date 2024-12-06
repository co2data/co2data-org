import { Config, Effect, Layer, Secret } from 'effect'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

const getSessionEffect = (password: Secret.Secret) =>
  Effect.tryPromise(async () =>
    // @ts-ignore
    getIronSession<{ username?: string }>(await cookies(), {
      password: Secret.value(password),
      cookieName: 'user-session',
    }),
  ).pipe(Effect.orDie)

const make = Effect.gen(function* ($) {
  const sessionPassword = yield* $(Config.secret('SESSION_PASSWORD'))
  return {
    getSession: () =>
      getSessionEffect(sessionPassword).pipe(
        Effect.map((session) => session.username),
        Effect.withSpan('get session'),
      ),
    setSession: (username: string) => {
      return getSessionEffect(sessionPassword).pipe(
        Effect.flatMap((session) =>
          Effect.tryPromise(() => {
            session.username = username
            return session.save()
          }),
        ),
        Effect.orDie,
        Effect.withSpan('set session'),
      )
    },
    deleteSession: () =>
      getSessionEffect(sessionPassword).pipe(
        Effect.map((session) => session.destroy()),
        Effect.withSpan('deleteSession'),
      ),
  }
})

export class Session extends Effect.Tag('@services/Session')<
  Session,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make)
}
