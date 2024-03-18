/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Powered-By",
    value: "Queensland Government",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; frame-ancestors 'self'; img-src 'self'; font-src 'self' data:; connect-src 'self' https://qdap-dev-apim.azure-api.net https://qdap-prd-apim.developer.azure-api.net *.ai.qld.gov.au https://australiaeast-1.in.applicationinsights.azure.com/ https://australiaeast.livediagnostics.monitor.azure.com/; media-src 'self'; frame-src 'self'; object-src 'none';",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "accelerometer=(),autoplay=(),camera=(),display-capture=(),encrypted-media=(),fullscreen=(),geolocation=(),gyroscope=(),magnetometer=(),microphone=(),midi=(),payment=(),picture-in-picture=(),publickey-credentials-get=(),screen-wake-lock=(),sync-xhr=(self),usb=(),xr-spatial-tracking=()",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
  {
    key: "X-Download-Options",
    value: "noopen",
  },
  {
    key: "X-Permitted-Cross-Domain-Policies",
    value: "none",
  },
  {
    key: "Cross-Origin-Embedder-Policy",
    value: "require-corp",
  },
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
]

const nextConfig = {
  output: "standalone",
  compiler: {
    removeConsole: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  devIndicators: {
    buildActivityPosition: "bottom-right",
  },
  experimental: {
    instrumentationHook: true,
    serverComponentsExternalPackages: ["@azure/storage-blob"],
    serverActions: {
      allowedOrigins: ["*.ai.qld.gov.au", "qggptprodopenai.azurewebsites.net", "qggptdevopenai.azurewebsites.net"],
    },
  },
  redirects() {
    return [
      {
        source: "/login",
        destination: "/api/auth/signin/azure-ad",
        permanent: true,
      },
      {
        source: "/logout",
        destination: "/api/auth/signout",
        permanent: true,
      },
    ]
  },
  headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/:path*{/}?",
        headers: [
          {
            key: "X-Accel-Buffering",
            value: "no",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
