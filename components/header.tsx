import Link from 'next/link'
import { ModeToggle } from './mode-toggle'

const Header = () => {
  return (
    <header className="bg-border text-white">
      <nav className="container mx-auto flex gap-4 px-4 py-3">
        <Link className="flex-1 font-bold" href="/">
          CO<sub>2</sub> Data
        </Link>
        <Link href="/">
          CO<sub>2</sub> Contributors
        </Link>
        <Link href="/about">About</Link>
        <ModeToggle className="-my-2" />
      </nav>
    </header>
  )
}

export default Header
