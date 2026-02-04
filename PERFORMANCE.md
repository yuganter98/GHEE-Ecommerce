# Performance Strategy

## Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Implemented Strategies (Phase 1)
- **Image Optimization**:
    - Enforced `next/image` usage.
    - Modern formats (`avif`, `webp`) enabled in `next.config.js`.
- **Font Optimization**:
    - `next/font/google` used for `Inter` and `Playfair Display` (zero layout shift, self-hosted automatically).
- **Code Splitting**:
    - Next.js App Router automatically splits routes.
- **Environment**:
    - `process.env` validation prevents runtime config delays/errors.

## Recommendations for Devs
1. **Always use `<Image />` component** for bitmaps.
2. **Avoid large layout shifts**: Define dimensions for containers.
3. **Lazy Load**: Use `dynamic()` for heavy below-the-fold components in future.
