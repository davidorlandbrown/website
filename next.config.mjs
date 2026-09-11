import createMDX from "@next/mdx";
import { createRequire } from "node:module";
import withBundleAnalyzer from "@next/bundle-analyzer";

// require resolves plugin module paths for the MDX loader in ESM config files.
const require = createRequire(import.meta.url);

// gfmAlertsAsCalloutsPlugin points at the local remark plugin that maps GFM alerts to Callout nodes.
const gfmAlertsAsCalloutsPlugin = require.resolve(
  "./src/lib/docs/remark-gfm-alerts-as-callouts.mjs",
);

// headingIdsPlugin points at the local remark plugin that applies stable heading IDs.
const headingIdsPlugin = require.resolve(
  "./src/lib/docs/remark-heading-ids.mjs",
);

// syntaxHighlightingPlugin points at the local rehype plugin that enables code highlighting.
const syntaxHighlightingPlugin = require.resolve(
  "./src/lib/docs/rehype-highlight-all.mjs",
);

// withMDX configures the Next.js MDX pipeline for docs rendering.
const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      "remark-gfm",
      gfmAlertsAsCalloutsPlugin,
      headingIdsPlugin,
    ],
    rehypePlugins: [syntaxHighlightingPlugin],
  },
});

// nextConfig contains shared website framework and header behavior.
/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  reactStrictMode: true,
  experimental: {
    // The homepage animation and docs reference pages intentionally ship
    // larger static payloads than Next.js defaults for page-data warnings.
    largePageDataBytes: 2 * 1024 * 1024,
    // Enable streaming for faster First Contentful Paint
    streamingRouteChunks: true,
  },
  env: {
    GIT_COMMIT_REF: process.env.VERCEL_GIT_COMMIT_REF || "",
  },

  async headers() {
    const headers = [
      // Cache static assets for 1 year (immutable)
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
      // Cache hashed JS/CSS files for 1 year
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
      // Cache public images for 1 year
      {
        source: "/public/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, immutable, max-age=31536000",
          },
        ],
      },
      // Cache HTML pages for 24 hours
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=86400",
          },
          {
            key: "Vary",
            value: "Accept-Encoding",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];

    if (process.env.VERCEL_ENV !== "production") {
      headers.push({
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
        source: "/:path*",
      });
    }

    return headers;
  },
};

const config = withMDX(nextConfig);
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(config);
