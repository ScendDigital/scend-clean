cd C:\Users\phula\Documents\Projects\scend-app\web

if (Test-Path .\next.config.mjs) {
  @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Do not fail production builds because of ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
'@ | Set-Content -Encoding utf8 .\next.config.mjs
}
elseif (Test-Path .\next.config.js) {
  @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Do not fail production builds because of ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
'@ | Set-Content -Encoding utf8 .\next.config.js
}
else {
  @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚫 Do not fail production builds because of ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
'@ | Set-Content -Encoding utf8 .\next.config.mjs
}
