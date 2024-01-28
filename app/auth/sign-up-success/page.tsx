import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SignUpSuccess() {
  return (
    <section>
      <h1 className="my-6 text-4xl font-bold">Sign up successful</h1>
      <p>
        Thank you for signing up. You can{' '}
        <Link href={'/auth/login'}>login</Link> now.
      </p>
      <div className="h-4"></div>
      <Button asChild>
        <Link href={'/auth/login'} className="!no-underline">
          Go to Login
        </Link>
      </Button>
    </section>
  )
}