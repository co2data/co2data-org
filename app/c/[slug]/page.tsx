import { getCo2AverageBySlug } from '@/domain/repository'

export default async function Home({ params }: { params: { slug: string } }) {
  const { title, slug, unit, avg_per_unit, avg_per_year } =
    await getCo2AverageBySlug(params.slug)

  return (
    <main className="container mx-auto px-4">
      <ul>
        <li key={title}>
          <p>{title}</p>
          <p>
            Possible CO<sub>2</sub>e per person-year
          </p>
          <p>{avg_per_year} g</p>
          <p>
            1 {unit} {avg_per_unit} g CO<sub>2</sub>e
          </p>
        </li>
      </ul>
    </main>
  )
}
