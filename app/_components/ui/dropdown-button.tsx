'use client'

import { useTransition } from 'react'
import { DropdownMenuItem } from './dropdown-menu'

export default function DropdownButton(props: {
  onClick: () => Promise<void>
  children: React.ReactNode
}) {
  const [isPending, startTransition] = useTransition()
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => startTransition(props.onClick)}
    >
      {props.children}
    </DropdownMenuItem>
  )
}
