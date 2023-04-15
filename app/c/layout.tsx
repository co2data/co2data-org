import SearchBox from './search-box'

export default function ContributorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <h1>Contributors</h1>
      <SearchBox />
      {children}
    </section>
  )
}
