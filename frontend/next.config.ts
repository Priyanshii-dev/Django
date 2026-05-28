import type { NextConfig } from "next";

const nextConfig = {
  output: "standalone",
  experimental: {
    reactCompiler: true,
    ppr: false,
  },
};

export default nextConfig;
