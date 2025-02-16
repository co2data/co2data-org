import runtime from '@/adapter/effect/runtime'
import { type Co2Average, Co2Repository } from '@/domain/co2'
import { Effect, Metric } from 'effect'
import { baseUrl } from '../config'

export const dynamic = 'force-dynamic'

const dbErrorCount = Metric.counter('db_error_count').pipe(
  Metric.withConstantInput(1),
)

export async function GET() {
  return Co2Repository.getAllCo2Averages.pipe(
    Effect.map(renderResponse),
    // Metric.trackErrorWith(dbErrorCount, constant(1)),  // I don't know how Metrics work...
    Effect.catchAll((error) =>
      Effect.succeed(new Response(error._tag, { status: 500 })),
    ),
    runtime.runPromise,
  )
}

function renderResponse(co2Averages: Co2Average[]) {
  return new Response(`
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>0.8</priority>
  </url>    
  <url>
    <loc>${baseUrl}/about</loc>
  </url>    
  ${co2Averages
    .map((co2Average) => {
      return `  <url>
    <loc>${baseUrl}/c/${co2Average.slug}</loc>
  </url>    
`
    })
    .join('')}
</urlset>  
`)
}
