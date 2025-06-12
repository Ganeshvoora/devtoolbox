import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ignores: ['app/generated/prisma/**'],
};

export default nextConfig;
