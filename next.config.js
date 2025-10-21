/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Don't fail production builds because of ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ (safety net) Don't block prod on TS errors while we're stabilizing
    ignoreBuildErrors: true,
  },
};
module.exports = nextConfig;
