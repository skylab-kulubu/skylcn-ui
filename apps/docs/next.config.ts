import type { NextConfig } from 'next';

// DOCS_EXPORT=1 builds plain files into out/ for any static host; DOCS_BASE_PATH
// serves them under a sub-path, such as /playground on the admin panel
const exporting = process.env.DOCS_EXPORT === '1';

const nextConfig: NextConfig = exporting
  ? {
      output: 'export',
      basePath: process.env.DOCS_BASE_PATH || undefined,
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
