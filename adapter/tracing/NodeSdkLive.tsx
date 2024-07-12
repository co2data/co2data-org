import { NodeSdk } from '@effect/opentelemetry'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Config, Duration, Effect, Layer, Option, Secret } from 'effect'

const GrafanaTempoConfig = Config.nested('OTLP')(
  Config.all({
    url: Config.string('URL'),
    auth: Config.option(Config.secret('AUTH')),
  }),
)

export const NodeSdkLive = Layer.unwrapEffect(
  Effect.gen(function* ($) {
    const { url, auth } = yield* $(GrafanaTempoConfig)
    const headers = yield* $(makeHeaders(auth))
    const traceExporter = new OTLPTraceExporter({ url, headers })
    const metricExporter = new OTLPMetricExporter({
      url: 'https://xxxx.grafana.net/otlp/v1/metrics', //'http://127.0.0.1:9090/api/v1/otlp/v1/metrics',
      headers: {
        Authorization: 'Basic xxxx=',
      },
    })

    return NodeSdk.layer(() => ({
      resource: {
        serviceName: 'nextjs',
      },
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 100,
      }),
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
