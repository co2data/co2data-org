import { Config, Context, Effect, Layer, Option, Secret } from 'effect'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

const getSessionEffect = (password: Secret.Secret) =>
  Effect.tryPromise(() =>
    // @ts-ignore
    getIronSession<{ id?: string; username?: string }>(cookies(), {
      password: Secret.value(password),
      cookieName: 'user-session',
    }),
  ).pipe(Effect.orDie)

const make = Effect.gen(function* ($) {
  const sessionPassword = yield* $(Config.secret('SESSION_PASSWORD'))
  return {
    getSession: () =>
      getSessionEffect(sessionPassword).pipe(
        Effect.tap(({ username }) => Effect.annotateCurrentSpan({ username })), // does this break the tracing?
        Effect.map(({ id, username }) => {
          if (id && username) {
            return Option.some({ id, username })
          }
          return Option.none()
        }),
        Effect.withSpan('get session'),
      ),
    setSession: (id: string, username: string) => {
      return getSessionEffect(sessionPassword).pipe(
        Effect.flatMap((session) =>
          Effect.tryPromise(() => {
            session.id = id
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

export class Session extends Context.Tag('@services/Session')<
  Session,
  Effect.Effect.Success<typeof make>
>() {
  static Live = Layer.effect(this, make)
}

export const { getSession, setSession, deleteSession } =
  Effect.serviceFunctions(Session)
