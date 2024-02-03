import { run } from '@/adapter/effect'
import { getSession } from '@/adapter/session'
import { Button } from '@/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu'
import { Effect } from 'effect'
import Link from 'next/link'
import { Avatar, AvatarFallback } from './ui/avatar'
import DropdownButton from './ui/dropdown-button'

import { runServerAction } from '@/adapter/effect'
import { deleteSession } from '@/adapter/session'
import { redirect } from 'next/navigation'

export const gotoSettings = async () => {
  'use server'
  redirect('/')
}
export const logout = async () => {
  'use server'
  await deleteSession().pipe(runServerAction('logout'))
}

const UserEffect = (props: { className?: string }) => {
  return Effect.gen(function* ($) {
    const username = yield* $(getSession())

    if (!username) {
      return (
        <div className="flex gap-4">
          <Link href={'/login'}>Sign up</Link>
          <Link href={'/login'}>Login</Link>
        </div>
      )
    }
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title={`User ${username}`}
              className={props.className}
            >
              <Avatar>
                <AvatarFallback>{username?.slice(0, 2)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownButton onClick={logout}>Logout {username}</DropdownButton>
            {/* <DropdownButton onClick={gotoSettings}>Settings</DropdownButton> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    )
  })
}

const User = run(UserEffect)
export default User
