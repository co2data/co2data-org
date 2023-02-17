import { getCo2AverageBySlug } from '@/domain/repository'
import Link from 'next/link'

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
    <main className="space-y-8">
      <header className="space-y-8">
        <nav>
          <ol className="flex gap-3">
            <li>
              <Link href="/">Contributors</Link>
            </li>
            <li style={{ listStyle: "'>'" }} className="ml-2 pl-2">
              {co2Average.title}
            </li>
          </ol>
        </nav>
        <h1 className="text-4xl font-bold leading-6">
          {co2Average.title}
          <br />
          <small className="text-sm font-normal">
            CO<sub>2</sub> emissions
          </small>
        </h1>
      </header>
      <p className="text-4xl">
        <span>1 {co2Average.unit}</span>
        <svg className="inline-block h-6 w-12" viewBox="-40 0 140 120">
          <path
            fill="transparent"
            stroke="black"
            strokeWidth="10"
            d="M -10,50 L 90,50 M 50,10 L 90,50 L 50,90"
          ></path>
        </svg>{' '}
        <span>{co2Average.avg_per_unit}</span>{' '}
        <span className="text-base">
          g CO<sub>2</sub>e
        </span>
      </p>
      <p>
        Possible CO<sub>2</sub>e per person-year
        <br />
        <span className="font-bold">
          {+parseFloat(((co2Average.avg_per_year ?? 1) / 1000).toFixed(3))}
        </span>{' '}
        <span className="text-sm font-normal">kg</span>
      </p>
    </main>
  )
}
