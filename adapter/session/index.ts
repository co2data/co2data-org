import { Config, Context, Effect, Layer, Redacted } from 'effect'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

const getSessionEffect = (password: Redacted.Redacted) =>
  Effect.tryPromise(async () =>
    getIronSession<{ username?: string }>(await cookies(), {
      password: Redacted.value(password),
      cookieName: 'user-session',
    }),
  ).pipe(Effect.orDie)

const make = Effect.gen(function* () {
  const sessionPassword = yield* Config.Redacted('SESSION_PASSWORD')
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

export class Session extends Context.Service<
  Session,
  Effect.Success<typeof make>
>()('@services/Session') {
  static Live = Layer.effect(this, make)
}
