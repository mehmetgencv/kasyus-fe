import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    images: {
        domains: ['localhost'], // Eski yöntem
    },
};

console.log('next.config.ts yüklendi');
export default nextConfig;