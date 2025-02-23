import runtime from '@/adapter/effect/runtime'
import { baseUrl } from '@/app/config'
import Opt from '@/components/opt'
import PersonalCo2 from '@/components/personal-co2'
import Source from '@/components/source'
import { type Co2Average, Co2Repository } from '@/domain/co2'
import { SourceRepository } from '@/domain/source'
import { setLogLevelFromSearchParams } from '@/lib/utils'
import convert from 'convert'
import { Effect, Option, Struct, pipe } from 'effect'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{
    slug: string
  }>
  searchParams: Promise<{
    logLevel?: string
  }>
}

export default async function ContributorPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  return Effect.gen(function* (_) {
    const co2Average = yield* _(
      Co2Repository.getCo2AverageBySlug(params.slug),
      Effect.map(Option.getOrElse(notFound)),
    )
    const sources = yield* _(
      SourceRepository.getAllSourcesByCo2ProducerId(co2Average.id),
    )

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
            <div className="flex flex-wrap items-baseline gap-4">
              <h1 className="font-extrabold text-4xl">
                <div>{co2Average.title}</div>
                <div className="font-normal text-sm">
                  CO<sub>2</sub> emissions
                </div>
              </h1>
              <Opt>
                {Option.map(co2Average.description, (_) => (
                  <p>{_}</p>
                ))}
              </Opt>
            </div>
            <p className="text-4xl">
              <span>1 {co2Average.unit}</span>
              <svg className="inline-block h-6 w-12" viewBox="-40 0 140 120">
                <title>is</title>
                <path
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="10"
                  d="M -10,50 L 90,50 M 50,10 L 90,50 L 50,90"
                />
              </svg>
              <span className="font-bold">
                {convert(co2Average.avgPerUnit, 'grams')
                  .to('kg')
                  .toFixed(3)}{' '}
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
            <PersonalCo2
              co2Average={pipe(co2Average, Struct.omit('description'))}
            />
          </section>
          <section className="space-y-4">
            <h2 className="font-bold text-xl">Sources</h2>
            {sources.map((source) => (
              <Source key={source.id} source={source} unit={co2Average.unit} />
            ))}
          </section>
        </div>
      </main>
    )
  }).pipe(
    Effect.withSpan(`Render c/${params.slug}/page`, {
      attributes: { slug: params.slug },
    }),
    Effect.catchTags({
      DbError: (_cause) =>
        Effect.succeed(<main>Database error {JSON.stringify(_cause)}</main>),
    }),
    setLogLevelFromSearchParams(searchParams),
    runtime.runPromise,
  )
}

export async function generateMetadata(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  return Effect.gen(function* () {
    const co2AverageRepo = yield* Co2Repository
    const co2Average = yield* co2AverageRepo.getCo2AverageBySlug(params.slug)
    if (Option.isNone(co2Average)) {
      notFound()
    }
    return mapMetadata(params)(co2Average.value)
  }).pipe(
    setLogLevelFromSearchParams(searchParams),
    Effect.withSpan('Generate metadata c/[slug]/page', {
      attributes: { slug: params.slug },
    }),
    runtime.runPromise,
  )
}

function mapMetadata(params: { slug: string }) {
  return (co2Average: Co2Average) => {
    const description = `The CO₂ emissions of 1 ${co2Average.unit} of "${
      co2Average.title
    }" are ${convert(co2Average.avgPerUnit, 'grams')
      .to('kg')
      .toFixed(3)} kg CO₂e`

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
    } satisfies Metadata
  }
}
