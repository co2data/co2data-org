import { baseUrl } from '@/app/config'
import PersonalCo2 from '@/components/personal-co2'
import Source from '@/components/source'
import { Co2Average, Co2Repository, co2RepoLive } from '@/domain/co2'
import { SourceRepository, sourceRepoLive } from '@/domain/source'
import { NodeSdkLive } from '@/infra/tracing/NodeSdkLive'
import { mapToJSX, setLogLevelFromSearchParams } from '@/lib/utils'
import convert from 'convert'
import { Effect, Layer, Option, Struct, flow, pipe } from 'effect'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'

type Props = {
  params: {
    slug: string
  }
  searchParams: {
    logLevel?: string
  }
}

function ContributorPageEffect({ params, searchParams }: Props) {
  return Effect.gen(function* (_) {
    const co2Average = yield* _(getCo2Average(params.slug))
    const sources = yield* _(getSources(co2Average.id))

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
              <h1 className="text-4xl font-extrabold">
                <div>{co2Average.title}</div>
                <div className="text-sm font-normal">
                  CO<sub>2</sub> emissions
                </div>
              </h1>
              {co2Average.description.pipe(
                mapToJSX((description) => (
                  <p key="description">{description}</p>
                ))
              )}
            </div>
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
            <PersonalCo2
              co2Average={pipe(co2Average, Struct.omit('description'))}
            />
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
  }).pipe(
    Effect.withSpan(`Render c/${params.slug}/page`, {
      attributes: { slug: params.slug },
    }),
    Effect.catchTags({
      DbError: (cause) => Effect.succeed(<main>Database error</main>),
    }),
    setLogLevelFromSearchParams({ searchParams })
  ) satisfies Effect.Effect<any, never, JSX.Element>
}

function getCo2Average(slug: string) {
  return Effect.flatMap(Co2Repository, (co2Repo) =>
    co2Repo
      .getCo2AverageBySlug(slug)
      .pipe(Effect.map(Option.getOrElse(notFound)))
  )
}

function getSources(id: string) {
  return Effect.flatMap(SourceRepository, (sourceRepo) =>
    sourceRepo.getAllSourcesByCo2ProducerId(id)
  )
}

function generateMetadataEffect({ params, searchParams }: Props) {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getCo2AverageBySlug(params.slug)),
    Effect.map(Option.getOrElse(notFound)),
    Effect.map(mapMetadata(params)),
    Effect.orElseSucceed(() => ({})),
    setLogLevelFromSearchParams({ searchParams }),
    Effect.withSpan('Generate metadata c/[slug]/page', {
      attributes: { slug: params.slug },
    })
  ) satisfies Effect.Effect<any, never, Metadata>
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

const ContributorPage = flow(
  ContributorPageEffect,
  Effect.provide(Layer.merge(co2RepoLive, sourceRepoLive)),
  Effect.provide(NodeSdkLive),
  Effect.runPromise
)
export default ContributorPage

export const generateMetadata = flow(
  generateMetadataEffect,
  Effect.provide(co2RepoLive),
  Effect.provide(NodeSdkLive),
  Effect.runPromise
)
