import { Co2Average, Co2Repository, co2RepoLive } from '@/domain/co2'
import { baseUrl } from '../config'
import { Effect } from 'effect'

export async function GET() {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getAllCo2Averages()),
    Effect.map(renderResponse),
    Effect.provide(co2RepoLive),
    Effect.runPromise
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
