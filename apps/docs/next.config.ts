import type { NextConfig } from 'next';

// DOCS_EXPORT=1 builds plain files into out/ for any static host; DOCS_BASE_PATH
// serves them under a sub-path.
//
// NEXT_PUBLIC_DOCS_HOST=admin builds the playground for the admin panel, which
// serves out/playground* from its public folder: the pages already live under
// /playground, and the assets move to /playground-assets so they never meet the
// admin app's own /_next.
const hosted = process.env.NEXT_PUBLIC_DOCS_HOST === 'admin';
const exporting = hosted || process.env.DOCS_EXPORT === '1';

const nextConfig: NextConfig = exporting
  ? {
      output: 'export',
      basePath: hosted ? undefined : process.env.DOCS_BASE_PATH || undefined,
      assetPrefix: hosted ? '/playground-assets' : undefined,
      trailingSlash: !hosted,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
