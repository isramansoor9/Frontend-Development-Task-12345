/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: new URL(".", import.meta.url).pathname,
  images: {
    imageSizes: [16, 32, 48, 64, 88, 96, 120, 128, 256, 306, 384, 640],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "sample-videos.com" },
    ],
  },
};

export default nextConfig;
