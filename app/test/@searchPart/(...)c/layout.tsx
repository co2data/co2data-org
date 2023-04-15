import { ReactNode } from 'react'

export default function SearchDialogLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="relative m-auto max-w-xs">{children}</div>
  )
}
