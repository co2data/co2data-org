import Link from 'next/link'
import { ModeToggle } from './mode-toggle'
import { GithubLink } from './github-link'

const Header = () => {
  return (
    <header className="bg-border text-white">
      <nav className="container mx-auto flex gap-4 px-4 py-3">
        <div className="flex flex-1 flex-wrap justify-end gap-x-4 gap-y-2">
          <Link className="flex-1 font-bold" href="/">
            CO<sub>2</sub>&nbsp;Data
          </Link>
          <Link href="/">
            CO<sub>2</sub> Contributors
          </Link>
          <Link href="/about">About</Link>
        </div>
        <div className="flex">
          <GithubLink />
          <ModeToggle className="-my-2" />
        </div>
      </nav>
    </header>
  )
}

export default Header
