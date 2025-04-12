/** @type {import('next').NextConfig} */

// Get the hostname from the environment variable (or use a default)
const apiUrl = process.env.NEXT_PUBLIC_URL || '';
let hostname = '';

try {
  // Extract hostname from URL (removes protocol and path)
  if (apiUrl) {
    const url = new URL(apiUrl);
    hostname = url.hostname;
  }
} catch (e) {
  console.warn('Invalid NEXT_PUBLIC_API_URL, using fallback for image domains');
}

// Use the extracted hostname or fallbacks
const domains = hostname ? [hostname] : ['caphetamgiao.local'];

const nextConfig = {
  images: {
    domains,
  },
};

module.exports = nextConfig;