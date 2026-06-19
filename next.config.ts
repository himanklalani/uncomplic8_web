import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow local network IP for mobile testing
  allowedDevOrigins: ['192.168.0.104', '192.168.29.61', 'localhost'],
};

export default nextConfig;
