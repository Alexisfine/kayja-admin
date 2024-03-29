/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode:false,
    images: {
        domains: ['kayja-img.oss-cn-shenzhen.aliyuncs.com'],
    },
    basePath: '/admin'
}
export default nextConfig;
