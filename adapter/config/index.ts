import {
  type CloudflareContext,
  getCloudflareContext,
} from '@opennextjs/cloudflare'
import { ConfigProvider, Layer, Record, pipe } from 'effect'

export const ConfigLive = Layer.suspend(() =>
  pipe(
    getCloudflareContext().env,
    ({ DB, NEXT_CACHE_WORKERS_KV, ASSETS, ...onlyEnvVars }) => onlyEnvVars,
    Record.toEntries,
    (env) => new Map(env),
    ConfigProvider.fromMap,
    Layer.setConfigProvider,
  ),
)
