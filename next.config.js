/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "etgrmcgfmeaammbrxfnh.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
}

export default nextConfig
