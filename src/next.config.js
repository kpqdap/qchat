/** @type {import('next').NextConfig} */

const localUrl = process.env.QGAIP_QCHAT_FQDN_URI;
const fullUrl = process.env.QGAIP_QCHAT_APP_URI;

const securityHeaders = [
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Powered-By',
    value: 'QG',
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src * data: blob:; font-src 'self' data:; connect-src 'self' https://qdap-dev-apim.azure-api.net; media-src 'self'; frame-src 'self'; object-src 'none';"
  },
];

const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [localUrl, fullUrl],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
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
    ];
  },
};

module.exports = nextConfig;
