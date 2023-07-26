import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="space-y-4">
      <h1 className="text-5xl">Not Found</h1>
      <p>Could not find requested resource.</p>
      <p>
        <Link href="/">
          <Button>
            Go to CO<sub>2</sub>&nbsp;contributors
          </Button>
        </Link>
      </p>
    </div>
  )
}
