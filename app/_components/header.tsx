import Link from 'next/link'
import { GithubLink } from './github-link'
import { ModeToggle } from './mode-toggle'
import User from './user'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-border text-white drop-shadow-sm">
      <nav className="container flex gap-4 py-3">
        <div className="flex flex-1 flex-wrap justify-end gap-x-4 gap-y-2">
          <Link className="flex-1 font-extrabold" href="/">
            CO<sub>2</sub>&nbsp;Data
          </Link>
          <div className="flex flex-wrap justify-end gap-x-4 gap-y-2">
            <Link href="/about">About</Link>
            <div className="flex">
              <GithubLink />
              <ModeToggle className="-my-2" />
              <User className="-my-2" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
