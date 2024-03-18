import { AzureMonitorTraceExporter } from "@azure/monitor-opentelemetry-exporter"
import { registerOTel } from "@vercel/otel"

export function register(): void {
  registerOTel({
    serviceName: "QChat",
    traceExporter: new AzureMonitorTraceExporter({
      connectionString: process.env.AZURE_APPLICATIONINSIGHTS_CONNECTION_STRING,
    }),
  })
}
