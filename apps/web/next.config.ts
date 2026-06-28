import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@living-textbook/content-model", "@living-textbook/ui"],
};

export default nextConfig;
