import runtime from '@/adapter/effect/runtime'
import { Session } from '@/adapter/session'
import { Effect } from 'effect'
import UserClient from './user-client'

export default function User(props: { className?: string }) {
  return Effect.gen(function* ($) {
    const username = yield* $(Session.getSession())

    return <UserClient username={username} className={props.className} />
  }).pipe(runtime.runPromise)
}
