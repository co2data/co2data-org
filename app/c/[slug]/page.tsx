import { getCo2AverageBySlug } from '@/domain/repository'

export default async function Home({ params }: { params: { slug: string } }) {
  const co2Average = await getCo2AverageBySlug(params.slug)

  if (!co2Average) {
    return (
      <main>
        <h1>No Data found.</h1>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4">
      <ul>
        <li key={co2Average.title}>
          <p>{co2Average.title}</p>
          <p>
            Possible CO<sub>2</sub>e per person-year
          </p>
          <p>{co2Average.avg_per_year} g</p>
          <p>
            1 {co2Average.unit} {co2Average.avg_per_unit} g CO<sub>2</sub>e
          </p>
        </li>
      </ul>
    </main>
  )
}
