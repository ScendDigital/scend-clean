const isVercel = !!process.env.VERCEL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ...your existing config above this line

  ...(isVercel ? { output: "standalone" } : {}),
};

export default nextConfig;
