/** @type {import('next').NextConfig} */

const localUrl = process.env.QGAIP_QCHAT_FQDN_URI;
const fullUrl = process.env.QGAIP_QCHAT_APP_URI;

const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: [localUrl,fullUrl],
    },
  },
};

module.exports = nextConfig;
