import { runServerAction } from '@/adapter/effect'
import runtime from '@/adapter/effect/runtime'
import { Session } from '@/adapter/session'
import { Button } from '@/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu'
import { Effect } from 'effect'
import { User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from './ui/avatar'
import DropdownButton from './ui/dropdown-button'

export const logout = async () => {
  'use server'
  await Session.deleteSession().pipe(runServerAction('logout'))
}

export default function User(props: { className?: string }) {
  return Effect.gen(function* ($) {
    const username = yield* $(Session.getSession())

    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title={`User ${username ?? 'not logged in'}`}
              className={props.className}
            >
              <Avatar>
                <AvatarFallback>
                  {username ? username.slice(0, 2) : <UserIcon size={18} />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {username ? (
              <DropdownButton onClick={logout}>
                Logout {username}
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
  }).pipe(runtime.runPromise)
}
