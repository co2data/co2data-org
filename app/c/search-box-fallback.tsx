export default function SearchBoxFallback() {
  return (
    <>
      <label htmlFor="search" className="sr-only"></label>
      <input
        className="rounded border-2 border-sky-600 bg-blue-50 opacity-20  focus:ring-4 focus:ring-sky-100"
        title="Search"
        placeholder="Search"
        type="search"
        name="search"
        id="search"
        disabled
      />
    </>
  )
}
