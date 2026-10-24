import { WebSdk } from '@effect/opentelemetry'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Config, Duration, Effect, Layer, Option, Redacted } from 'effect'

const GrafanaConfig = Config.all({
  url: Config.String('OTLP_URL'),
  auth: Config.option(Config.Redacted('OTLP_AUTH')),
})

export const TracingLive = Layer.unwrap(
  Effect.gen(function* () {
    const { url, auth } = yield* GrafanaConfig
    const headers = yield* makeHeaders(auth)
    const traceExporter = new OTLPTraceExporter({ url, headers })

    return WebSdk.layer(() => ({
      resource: {
        serviceName: 'nextjs',
      },
      spanProcessor: new BatchSpanProcessor(traceExporter, {
        scheduledDelayMillis: Duration.toMillis(Duration.seconds(1)),
      }),
    }))
  }),
)

function makeHeaders(auth: Option.Option<Redacted.Redacted>) {
  return Option.match(auth, {
    onNone: () => Effect.succeed<Record<string, string>>({}),
    onSome: (a) =>
      Effect.succeed<Record<string, string>>({
        Authorization: Redacted.value(a),
      }),
  })
}
