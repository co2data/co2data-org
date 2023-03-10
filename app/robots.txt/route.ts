import { baseUrl } from '../config'

export async function GET() {
  return new Response(`User-agent: *
Allow: 

Sitemap: ${baseUrl}/sitemap.xml`)
}
