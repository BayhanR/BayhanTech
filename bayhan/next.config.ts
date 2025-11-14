import type { NextConfig } from "next"
import path from "path"

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
  outputFileTracingRoot: path.join(__dirname),
  ...withBasePath,
}

export default nextConfig
