# Security Checklist & Guidelines

## Phase 1 Implementation
- [x] **Secure Headers**: Implemented in `next.config.js` and enforced via `middleware.ts`.
- [x] **Rate Limiting**: Stub implementation in `middleware.ts`. Should be upgraded to Redis in Phase 2.
- [x] **Bot Protection**: Basic User-Agent blocking in `middleware.ts`.
- [x] **Environment Validation**: `src/lib/env.ts` enforces `DATABASE_URL` and app URL presence.
- [x] **Database Security**:
    - `pg` pool used (no exposed credentials).
    - Connection strings via environment variables only.
    - `server-only` import in `db.ts` to prevent client-side leakage.
- [x] **Client/Server Boundary**:
    - Sensitive logic confined to `src/lib` and Server Components.
    - Explicit `'use client'` usage where needed (minimal in Phase 1).

## Future Requirements (Phase 2+)
- [ ] **Authentication**: Implement NextAuth.js or rigorous session management.
- [ ] **CSRF Protection**: Critical for forms/mutations.
- [ ] **Content Security Policy (CSP)**: Refine strict nonce-based CSP.
- [ ] **Input Sanitization**: Ensure all DB inputs are parameterized (already handled by `pg` query params, but watch for raw SQL).
