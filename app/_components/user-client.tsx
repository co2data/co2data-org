'use client'

import { Button } from '@/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu'
import { User as UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Avatar, AvatarFallback } from './ui/avatar'
import DropdownButton from './ui/dropdown-button'
import { logout } from './user-actions'

export default function UserClient(props: {
  username: string | undefined
  className?: string | undefined
}) {
  const { username, className } = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={`User ${username ?? 'not logged in'}`}
          className={className}
          useFormStatus={false}
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
          <DropdownButton onClick={logout}>Logout {username}</DropdownButton>
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
  )
}
