import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/favorites", destination: "/notebook", permanent: true }];
  },
};

export default nextConfig;
