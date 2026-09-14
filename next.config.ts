import type { NextConfig } from "next";

const repositoryBasePath = "/MiracleNight";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repositoryBasePath,
  assetPrefix: repositoryBasePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
