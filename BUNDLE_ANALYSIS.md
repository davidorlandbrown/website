# Bundle Analysis Guide

This document explains how to use the bundle analyzer to understand JavaScript bundle composition and identify optimization opportunities.

## Quick Start

Analyze the production bundle:

```bash
ANALYZE=true npm run build
```

This will:
1. Build the project
2. Generate interactive HTML bundle visualization files
3. Open them automatically in your browser (or create `.next/bundle-analysis/` folder)

## Where to Find Reports

After running `ANALYZE=true npm run build`, look for:

```
.next/bundle-analysis/
├── app-client.html      # Client-side bundle breakdown
└── app-server.html      # Server-side bundle breakdown
```

Open these HTML files in your browser to explore:
- **Bundle size** by module
- **Duplicate packages** (should be none after Phase 3 npm audit fix)
- **Importers** - which files depend on each module
- **Growth chart** - track bundle size over time

## Understanding the Visualizations

### Client Bundle (app-client.html)

Shows the JavaScript sent to browsers. Smaller = better for:
- **Page load time** (LCP, FCP)
- **User experience** on slower networks
- **Core Web Vitals** scores

**What to look for:**
- Packages > 200KB (candidates for lazy loading)
- Duplicate modules (would indicate configuration issues)
- Unused dependencies (check package.json)

### Server Bundle (app-server.html)

Shows backend code. Affects:
- **Build size** (disk storage)
- **Cold start time** (Vercel function initialization)

**What to look for:**
- MDX processing library size (expected ~500KB)
- Unused server dependencies
- Node.js specific modules not needed at runtime

## Current Bundle Metrics (Post-Phase-4)

| Metric | Value | Status |
|--------|-------|--------|
| **Client bundle** | ~4.1MB (static) | ✅ Optimized with lazy loading |
| **Mermaid library** | Lazy-loaded | ✅ Not in main bundle |
| **AnimatedTerminal** | Lazy-loaded | ✅ Homepage-only |
| **Largest chunk** | 424KB | ✅ Acceptable (below 500KB threshold) |
| **Duplicates** | 0 | ✅ Fixed in Phase 3 |

## How Bundle Size Affects Performance

### Impact on Core Web Vitals

1. **Largest Contentful Paint (LCP)** ← Bundle size
   - More code = slower parsing & execution
   - Lazy loading reduces initial LCP by 15-20%

2. **Cumulative Layout Shift (CLS)**
   - Not directly affected by bundle size
   - But lazy loading can improve by preventing layout thrashing

3. **Interaction to Next Paint (INP)**
   - Smaller JS = faster response to user input
   - Main thread less blocked by parsing

### Network Impact

```
Bundle Size → Download Time → Time to Interactivity

Fast 3G (1.6 Mbps):
- 1MB bundle ≈ 5s download
- 4MB bundle ≈ 20s download

LTE (10 Mbps):
- 1MB bundle ≈ 0.8s download
- 4MB bundle ≈ 3.2s download
```

## Optimization Checklist

After analyzing your bundle:

- [ ] No packages larger than 500KB (except necessary ones)
- [ ] No duplicate modules (check for duplicate versions of same package)
- [ ] Large dependencies are lazy-loaded (Mermaid, AnimatedTerminal)
- [ ] Tree-shaking working (imported functions actually used)
- [ ] No heavy analytics/tracking libraries in main bundle
- [ ] CSS is minified and unused styles removed

## Before/After Comparison (Phase 1-4)

### Phase 1-3 (Baseline)
- Static bundle: 4.1MB
- Main JavaScript: 2.3MB+ (top 15 chunks)
- Mermaid: Loaded on every page
- AnimatedTerminal: Included on all routes

### Phase 4 (Optimizations)
- Static bundle: 4.1MB (no size regression)
- Main JavaScript: ~1.5MB (after lazy loading)
- Mermaid: Loaded only on docs pages
- AnimatedTerminal: Loaded only on homepage
- Expected improvement: **30-40% faster initial load** for non-homepage routes

## Future Optimization Opportunities

1. **Code splitting by route**
   - Already done via Next.js automatic splitting
   - Verify with: `npm run build` output shows ~106 routes

2. **Third-party scripts**
   - If Google Analytics added: use `next/script` with `strategy="lazyOnload"`
   - Delay non-critical tracking scripts

3. **CSS optimization**
   - Current: Tailwind (auto tree-shakes unused styles)
   - Monitor with bundle analyzer CSS section

4. **Image optimization**
   - Phase 4.3 adds AVIF/WebP (30-50% smaller than PNG/JPG)
   - Images not counted in JavaScript bundle (but still impact performance)

## Automated Bundle Monitoring (Optional)

To track bundle size over time, consider:

1. **CI/CD Integration** (GitHub Actions)
   ```bash
   ANALYZE=true npm run build
   # Compare new size vs baseline
   # Fail CI if bundle grows > 5%
   ```

2. **Vercel Analytics**
   - Automatically tracks bundle size over releases
   - Dashboard: vercel.com → website project → Analytics

3. **Web Vitals Dashboard**
   - Vercel automatically tracks real user metrics
   - Correlate with bundle size changes

## Troubleshooting

**Bundle analyzer won't open browser?**
- Manually open `.next/bundle-analysis/app-client.html` in your browser

**Bundle size increased after optimization?**
- Check `.next/server/chunks/` - static files might include more metadata
- This is expected when adding lazy loading infrastructure (minimal overhead)
- Focus on JavaScript chunks, not build size

**Can't find specific package in bundle?**
- Search bundle visualization for package name
- Use "Importers" to see which components depend on it

## References

- [Next.js Bundle Analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)
- [Web Vitals Impact on Performance](https://web.dev/vitals/)
- [JavaScript Performance Best Practices](https://developer.mozilla.org/en-US/docs/Web/Performance/Best_practices_for_JavaScript)
