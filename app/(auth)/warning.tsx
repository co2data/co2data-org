import { cn } from '@/lib/utils'

export default function Warning(props: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        `rounded border border-red-400/60 bg-red-500/10 p-4`,
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}
