/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  assetPrefix: basePath || undefined,
  basePath,
  images: {
    unoptimized: true
  },
  output: "export",
  trailingSlash: true
};

export default nextConfig;
