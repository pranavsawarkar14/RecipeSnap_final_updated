import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
    GOOGLE_GENAI_API_KEY: process.env.GOOGLE_GENAI_API_KEY,
  },
};

export default nextConfig;
