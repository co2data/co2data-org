import {
  type CloudflareContext,
  getCloudflareContext,
} from '@opennextjs/cloudflare'
import { Context, Layer } from 'effect'

export class DatabaseClient extends Context.Tag('@adapter/db/database-client')<
  DatabaseClient,
  CloudflareContext['env']['DB']
>() {
  // The construction needs to be suspended because the request context is not available at the time of the construction otherwise
  // See: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-nextjs-site/#top-level-getrequestcontext
  static D1 = Layer.suspend(() =>
    Layer.succeed(this, getCloudflareContext().env.DB),
  )
}
