import { baseUrl } from '@/app/config'
import PersonalCo2 from '@/components/personal-co2'
import Source from '@/components/source'
import { Co2Repository, repository } from '@/domain/co2'
import { getAllSourcesByCo2ProducerId } from '@/domain/source'
import convert from 'convert'
import { Effect, Option } from 'effect'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

type Params = {
  params: {
    slug: string
  }
}

export default async function Home({ params }: Params) {
  const co2Average = await Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getCo2AverageBySlug(params.slug)),
    Effect.map(Option.getOrElse(notFound)),
    Effect.provideLayer(repository),
    Effect.runPromise
  )

  const sources = await getAllSourcesByCo2ProducerId(co2Average.id)

  return (
    <main className="overflow-hidden">
      <header className="space-y-4">
        <nav>
          <ol className="flex gap-3">
            <li>
              <Link href="/">Contributors</Link>
            </li>
            <li className="ml-2 list-['>'] pl-2">{co2Average.title}</li>
          </ol>
        </nav>
        <div className="space-y-4 rounded-lg border border-border bg-card p-8">
          <h1 className="text-4xl font-bold">
            <div>{co2Average.title}</div>
            <div className="text-sm font-normal">
              CO<sub>2</sub> emissions
            </div>
          </h1>
          <p className="text-4xl">
            <span>1 {co2Average.unit}</span>
            <svg className="inline-block h-6 w-12" viewBox="-40 0 140 120">
              <path
                fill="transparent"
                stroke="currentColor"
                strokeWidth="10"
                d="M -10,50 L 90,50 M 50,10 L 90,50 L 50,90"
              ></path>
            </svg>
            <span className="font-bold">
              {convert(co2Average.avgPerUnit, 'grams').to('kg').toFixed(3)}{' '}
            </span>
            &nbsp;
            <span className="text-base">
              kg&nbsp;CO<sub>2</sub>e
            </span>
          </p>
        </div>
      </header>

      <div className="mt-4 space-y-16">
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

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const co2Average = await Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getCo2AverageBySlug(params.slug)),
    Effect.map(Option.getOrElse(notFound)),
    Effect.provideLayer(repository),
    Effect.runPromise
  )

  const description = `The CO₂ emissions of 1 ${co2Average.unit} of "${
    co2Average.title
  }" are ${convert(co2Average.avgPerUnit, 'grams').to('kg').toFixed(3)} kg CO₂e`

  return {
    metadataBase: new URL(baseUrl),
    title: co2Average.title,
    description,
    openGraph: {
      description,
      url: `/c/${params.slug}`,
      images: [
        {
          url: `/og/${co2Average.slug}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    alternates: {
      canonical: `/c/${params.slug}`,
    },
  }
}
