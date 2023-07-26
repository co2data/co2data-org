import { Github } from 'lucide-react'
import { Button } from './ui/button'

export function GithubLink() {
  return (
    <a
      className="contents"
      title="Github"
      href="https://github.com/co2data/co2data-org"
    >
      <Button className="-my-2" size="icon" variant="ghost">
        <Github className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Github</span>
      </Button>
    </a>
  )
}
