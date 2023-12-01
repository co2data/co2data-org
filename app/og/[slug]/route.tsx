import { run } from '@/adapter/effect'
import { createOgImageResponse } from './create-og-image-response'

export const runtime = 'edge'

export const GET = run(createOgImageResponse)
