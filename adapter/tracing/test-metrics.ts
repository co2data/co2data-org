import { NodeSdk } from '@effect/opentelemetry'
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { Console, Effect, Layer, Metric } from 'effect'

const NodeSdkLive = Layer.unwrapEffect(
  Effect.gen(function* ($) {
    const metricExporter = new OTLPMetricExporter({
      //'https://grafana.com/docs/grafana-cloud/send-data/otlp/send-data-otlp/'
      url: 'https://xxx.grafana.net/otlp/v1/metrics', //'http://127.0.0.1:9090/api/v1/otlp/v1/metrics',
      headers: {
        Authorization: 'Basic xxx=',
      },
    })

    return NodeSdk.layer(() => ({
      resource: {
        serviceName: 'nextjs',
      },
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 10,
      }),
    }))
  }),
)

// Create a counter named 'task_count' and increment it by 1 every time it's invoked
const taskCount = Metric.counter('task_count').pipe(Metric.withConstantInput(1))

const task1 = Effect.succeed(1).pipe(Effect.delay('100 millis'))
const task2 = Effect.succeed(2).pipe(Effect.delay('200 millis'))

const program = Effect.gen(function* (_) {
  const a = yield* _(taskCount(task1))
  const b = yield* _(taskCount(task2))
  return a + b
})

// const showMetric = Metric.value(taskCount).pipe(Effect.flatMap(Console.log))

Effect.runPromise(
  program.pipe(
    Effect.provide(NodeSdkLive),
    Effect.delay('2 seconds'),
    Effect.catchAllCause(Effect.logError),
  ),
).then(console.log)
