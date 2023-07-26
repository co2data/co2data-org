import { GithubLink } from './github-link'

const Footer = () => {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto flex px-4 py-3">
        <p className="flex-1">2023&ensp;•&ensp;co2data.org</p>
        <GithubLink />
      </div>
    </footer>
  )
}

export default Footer
