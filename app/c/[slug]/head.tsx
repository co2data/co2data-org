export default async function Head({ params }: { params: { slug: string } }) {
  const title = `${makeTitle(params.slug)} CO₂ emissions | co2data.org`

  return (
    <>
      <title>{title}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta
        name="description"
        content="What are the CO₂ emissions of things."
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#007bff" />
      <meta name="msapplication-TileColor" content="#007bff" />
      <meta name="theme-color" content="#007bff" />

      <meta property="og:title" content="CO2 Data" />
      <meta
        property="og:description"
        content="What are the CO₂ emissions of things."
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://co2data.org/c/${params.slug}`}
      />
    </>
  )
}

function makeTitle(slug: string) {
  return slug.replace(/-/g, ' ').replace(/\b[a-z]/g, function () {
    return arguments[0].toUpperCase()
  })
}
