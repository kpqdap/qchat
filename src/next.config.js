/** @type {import('next').NextConfig} */

const localUrl = process.env.QGAIP_QCHAT_FQDN_URI;
const fullUrl = process.env.QGAIP_QCHAT_APP_URI;

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
