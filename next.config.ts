import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/admin': ['./public/data/**/*'],
  },
};

export default nextConfig;

