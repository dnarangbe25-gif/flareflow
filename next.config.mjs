/** @type {import('next').NextConfig} */
// Force rebuild to pick up postcss.config.js
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fixes npm packages that depend on `fs` module
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    
    // Ignore sodium-native which causes build errors in Next.js
    config.externals.push({
      'sodium-native': 'sodium-native',
    });

    return config;
  },
};

export default nextConfig;
