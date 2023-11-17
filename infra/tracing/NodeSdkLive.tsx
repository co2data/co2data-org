import { NodeSdk } from '@effect/opentelemetry'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'

export const NodeSdkLive = NodeSdk.layer(() => ({
  resource: {
    serviceName: 'nextjs',
  },
  spanProcessor: new BatchSpanProcessor(
    new OTLPTraceExporter({
      url: process.env.OTLP_URL,
      headers: {
        Authorization: process.env.OTLP_AUTH,
      },
    })
  ),
}))
