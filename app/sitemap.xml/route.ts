import { Co2Repository, repository } from '@/domain/co2'
import { baseUrl } from '../config'
import { Effect } from 'effect'

function getAllCo2Averages() {
  return Co2Repository.pipe(
    Effect.flatMap((repo) => repo.getAllCo2Averages()),
    Effect.provideLayer(repository)
  )
}

export async function GET() {
  const co2Averages = await Effect.runPromise(getAllCo2Averages())
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
