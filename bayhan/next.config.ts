import type { NextConfig } from "next"

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/"
const normalizedBasePath =
  rawBasePath === "/" ? "" : rawBasePath.replace(/\/$/, "")

const withBasePath =
  normalizedBasePath !== ""
    ? {
        basePath: normalizedBasePath as `/${string}`,
        assetPrefix: normalizedBasePath,
      }
    : {}

const nextConfig: NextConfig = {
  trailingSlash: true,
  ...withBasePath,
}

export default nextConfig
