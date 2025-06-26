/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 빌드 시 TypeScript 오류를 무시
    ignoreBuildErrors: true,
  },
  eslint: {
    // 빌드 시 ESLint 오류를 무시
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
