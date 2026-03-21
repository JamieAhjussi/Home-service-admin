import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // รูปจาก pexels (ข้อมูลเดิมในตาราง)
      },
      {
        protocol: "https",
        hostname: "*.supabase.co", // รูปที่ upload ขึ้น Supabase Storage
      },
    ],
  },
};

export default nextConfig;
