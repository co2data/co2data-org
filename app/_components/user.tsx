import { run, runServerAction } from '@/adapter/effect'
import { deleteSession, getSession } from '@/adapter/session'
import { Button } from '@/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu'
import { Effect, Option, Predicate } from 'effect'
import { User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from './ui/avatar'
import DropdownButton from './ui/dropdown-button'

export const logout = async () => {
  'use server'
  await deleteSession().pipe(runServerAction('logout'))
}

const UserEffect = (props: { className?: string }) => {
  return Effect.gen(function* ($) {
    const username = yield* $(
      getSession(),
      Effect.map(Option.map((_) => _.username)),
    )

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title={`User ${Option.getOrElse(
                username,
                () => 'not logged in',
              )}`}
              className={props.className}
            >
              <Avatar>
                <AvatarFallback>
                  {Option.isSome(username) ? (
                    username.value.slice(0, 2)
                  ) : (
                    <UserIcon size={18} />
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Option.isSome(username) ? (
              <DropdownButton onClick={logout}>
                Logout {username.value}
              </DropdownButton>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href={'/login'}>Login</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={'/sign-up'}>Sign up</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  })
}

const User = run(UserEffect)
export default User
