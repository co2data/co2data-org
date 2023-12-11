import { NodeSdk } from '@effect/opentelemetry'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Config, Duration, Effect, Layer, Option, Secret } from 'effect'

const GrafanaTempoConfig = Config.nested('OTLP')(
  Config.all({
    url: Config.string('URL'),
    auth: Config.option(Config.secret('AUTH')),
  })
)

export const NodeSdkLive = Layer.unwrapEffect(
  Effect.gen(function* ($) {
    const { url, auth } = yield* $(GrafanaTempoConfig)
    const headers = yield* $(makeHeaders(auth))
    const traceExporter = new OTLPTraceExporter({ url, headers })

    return NodeSdk.layer(() => ({
      resource: {
        serviceName: 'nextjs',
      },
      spanProcessor: new BatchSpanProcessor(traceExporter, {
        scheduledDelayMillis: Duration.toMillis('1 seconds'),
      }),
    }))
  })
)

function makeHeaders(auth: Option.Option<Secret.Secret>) {
  return auth.pipe(
    Effect.map((a) => ({
      Authorization: Secret.value(a),
    })),
    Effect.orElseSucceed(() => ({}))
  )
}
