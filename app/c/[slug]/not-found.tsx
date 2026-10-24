import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="space-y-4">
      <header className="space-y-4">
        <nav>
          <ol className="flex gap-3">
            <li>
              <Link href="/">Contributors</Link>
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl font-bold">Not Found</h1>
      </header>
      <p>Could not find the requested contributor.</p>
      <p>
        <Link className="text-sky-600" href="/">
          Back to all contributors
        </Link>
      </p>
    </main>
  )
}
