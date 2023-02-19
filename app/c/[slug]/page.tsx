import PersonalCo2 from '@/components/personal-co2'
import Source from '@/components/source'
import { getCo2AverageBySlug } from '@/domain/co2'
import { getAllSourcesByCo2ProducerId } from '@/domain/source'
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
  const sources = await getAllSourcesByCo2ProducerId(co2Average?.id)

  return (
    <main className="">
      <header className="space-y-8">
        <nav>
          <ol className="flex gap-3">
            <li>
              <Link href="/">Contributors</Link>
            </li>
            <li className="ml-2 list-['>'] pl-2">{co2Average.title}</li>
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
      <section className="mt-16 space-y-8">
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
          <span className="font-bold">
            {+parseFloat(((co2Average.avg_per_unit ?? 1) / 1000).toFixed(3))}
          </span>{' '}
          <span className="text-base">
            kg CO<sub>2</sub>e
          </span>
        </p>
      </section>
      <div className="mt-32 gap-32 lg:flex">
        <section>
          <PersonalCo2 co2Average={co2Average} />
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-bold ">Sources</h2>
          {sources.map((source) => (
            <Source key={source.id} source={source} unit={co2Average.unit} />
          ))}
        </section>
      </div>
    </main>
  )
}
