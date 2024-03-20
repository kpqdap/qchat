export async function GET(_req: Request): Promise<Response> {
  try {
    const healthCheckUrl = process.env.QGAIP_APIM_HEALTHCHECK_URI
    if (!healthCheckUrl) {
      throw new Error("Health check URL is not defined")
    }

    const response = await fetch(healthCheckUrl)

    if (response.status !== 200) {
      throw new Error("API Management health check failed")
    }

    return new Response(JSON.stringify({ status: "OK" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error: unknown) {
    return new Response(JSON.stringify({ status: "Service Unavailable", error: (error as Error)?.message }), {
      status: 503,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
