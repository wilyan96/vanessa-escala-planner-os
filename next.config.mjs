/** @type {import('next').NextConfig} */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const isVercel = process.env.VERCEL === "1";

const nextConfig = {
  assetPrefix: !isVercel && basePath ? basePath : undefined,
  basePath: !isVercel && basePath ? basePath : undefined,
  images: {
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;
