import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**/*',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        port: '',
        pathname: '/**/*',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
        port: '',
        pathname: '/**/*',
        search: '',
      },
      {
        protocol: 'https',
        hostname: "images.pexels.com",
        port: '',
        pathname: '/**/*',
        search: '',
      },
      {
        protocol: 'https',
        hostname: "static-00.iconduck.com",
        port: '',
        pathname: '/**/*',
        search: '',
      },
    ],
  },
};

export default nextConfig;