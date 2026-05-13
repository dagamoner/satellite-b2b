import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/database", "@repo/ui", "@repo/validation"],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
