/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // edit: updated to new key. Was previously `allowedForwardedHosts`
      allowedOrigins: ["qchat-dev.ai.qld.gov.au","qggptdevopenai.azurewebsites.net"],
    },
  },
};

module.exports = nextConfig;
