import { WebSdk } from '@effect/opentelemetry'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Config, Duration, Effect, Layer, type Option, Secret } from 'effect'

const GrafanaConfig = Config.all({
  url: Config.string('OTLP_URL'),
  auth: Config.option(Config.secret('OTLP_AUTH')),
})

export const TracingLive = Layer.unwrapEffect(
  Effect.gen(function* ($) {
    const { url, auth } = yield* $(GrafanaConfig)
    const headers = yield* $(makeHeaders(auth))
    const traceExporter = new OTLPTraceExporter({ url, headers })

    return WebSdk.layer(() => ({
      resource: {
        serviceName: 'nextjs',
      },
      spanProcessor: new BatchSpanProcessor(traceExporter, {
        scheduledDelayMillis: Duration.toMillis('1 seconds'),
      }),
    }))
  }),
)

function makeHeaders(auth: Option.Option<Secret.Secret>) {
  return auth.pipe(
    Effect.map((a) => ({
      Authorization: Secret.value(a),
    })),
    Effect.orElseSucceed(() => ({})),
  )
}
