/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // ← add this
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;