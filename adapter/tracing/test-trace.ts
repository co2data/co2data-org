import * as NodeSdk from '@effect/opentelemetry/NodeSdk'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { Context, Layer } from 'effect'
import { seconds } from 'effect/Duration'
import * as Effect from 'effect/Effect'
import { pipe } from 'effect/Function'

/*
Test Trace with 

- docker compose --file '/Users/philipschonholzer/Development/co2data/docker/local/docker-compose.yaml' --project-name 'local' start
- tsx ./infra/tracing/test-trace.ts  
*/

export interface Random {
  readonly next: Effect.Effect<number>
}

export const Random = Context.GenericTag<Random>('@services/Random')

const RandomLive = Layer.succeed(
  Random,
  Random.of({
    next: Effect.succeed(1),
  }),
)
const NodeSdkLive = NodeSdk.layer(() => ({
  resource: {
    serviceName: 'example',
  },
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: 'http://127.0.0.1:4318/v1/traces',
    }),
  ),
}))

// Function to simulate a task with possible subtasks
const task = (
  name: string,
  delay: number,
  children: ReadonlyArray<Effect.Effect<void>> = [],
) =>
  Effect.gen(function* (_) {
    // const random = yield* _(Random)
    // const n = yield* _(random.next)
    yield* _(Effect.log(name))
    yield* _(Effect.sleep(`${delay} millis`))
    for (const child of children) {
      yield* _(child)
    }
    yield* _(Effect.sleep(`${delay} millis`))
  }).pipe(Effect.withSpan(name))

const poll = task('/poll', 1)

// Create a program with tasks and subtasks
const program = task('client', 2, [
  task('/api', 3, [
    task('/authN', 4, [task('/authZ', 5)]),
    task('/payment Gateway', 6, [task('DB', 7), task('Ext. Merchant', 8)]),
    task('/dispatch', 9, [
      task('/dispatch/search', 10),
      Effect.all([poll, poll, poll], { concurrency: 'inherit' }),
      task('/pollDriver/{id}', 11),
    ]),
  ]),
])

pipe(
  Effect.delay(program, seconds(1)),
  Effect.provide(NodeSdkLive),
  Effect.catchAllCause(Effect.logError),
  Effect.runPromise,
)
