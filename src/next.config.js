/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      // edit: updated to new key. Was previously `allowedForwardedHosts`
      allowedOrigins: [process.env.NEXTAUTH_ALLOWED_ORIGINS],
    },
  },
};

module.exports = nextConfig;
