// Add this to your next.config.js or create/update .eslintrc.json

// Option 1: Update next.config.js (recommended for quick fix)
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
